import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { MERGED_CATALOG_CONFIG } from "./catalog-merge-config.mjs";

const PORTOBELLO_IMAGE_FALLBACK = "/catalog/img_card_cover_main.svg";
const PROJECT111_IMAGE_BASE = resolveProject111ImageBase();
const OUTPUT_FILE = join(process.cwd(), "public", "_temp", "merged-catalog.json");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return readFileSync(filePath, "utf8");
}

function writeJson(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function resolveProject111ImageBase() {
  const rawValue = process.env.PROJECT111_IMAGE_BASE_URL?.trim();

  if (!rawValue) {
    return "/images/";
  }

  if (rawValue === "/") {
    return "/";
  }

  return rawValue.endsWith("/") ? rawValue : `${rawValue}/`;
}

function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#xA;/g, "\n")
    .replace(/&#10;/g, "\n")
    .replace(/&#13;/g, "\r");
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compareRu(left, right) {
  return left.localeCompare(right, "ru");
}

function parseNumber(value) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTagValue(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`));
  return match ? decodeXmlEntities(match[1]).trim() : null;
}

function getAllTagValues(block, tagName) {
  return [...block.matchAll(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, "g"))].map((match) => decodeXmlEntities(match[1]).trim());
}

function getTagAttrValue(block, tagName, attrName) {
  const match = block.match(new RegExp(`<${tagName}[^>]*\\s${attrName}="([^"]+)"[^>]*/?>`));
  return match ? decodeXmlEntities(match[1]).trim() : null;
}

function getNestedTagValue(block, parentTagName, childTagName) {
  const parentMatch = block.match(new RegExp(`<${parentTagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${parentTagName}>`));

  if (!parentMatch) {
    return null;
  }

  return getTagValue(parentMatch[0], childTagName);
}

function extractNestedBlocks(text, tagName) {
  const openTag = `<${tagName}>`;
  const closeTag = `</${tagName}>`;
  const blocks = [];
  let index = 0;
  let depth = 0;
  let blockStart = -1;

  while (index < text.length) {
    const nextOpen = text.indexOf(openTag, index);
    const nextClose = text.indexOf(closeTag, index);

    if (nextOpen !== -1 && (nextOpen < nextClose || nextClose === -1)) {
      if (depth === 0) {
        blockStart = nextOpen;
      }

      depth += 1;
      index = nextOpen + openTag.length;
      continue;
    }

    if (nextClose === -1) {
      break;
    }

    depth -= 1;
    index = nextClose + closeTag.length;

    if (depth === 0 && blockStart !== -1) {
      blocks.push(text.slice(blockStart, index));
      blockStart = -1;
    }
  }

  return blocks;
}

function getChildProductBlocks(block) {
  const outerOpenTag = "<product>";
  const outerCloseTag = "</product>";
  const inner = block.slice(outerOpenTag.length, block.length - outerCloseTag.length);
  return extractNestedBlocks(inner, "product");
}

function removeNestedProductBlocks(block) {
  const childBlocks = getChildProductBlocks(block);
  let clean = block;

  for (const childBlock of childBlocks) {
    clean = clean.replace(childBlock, "");
  }

  return clean;
}

function ensureAbsoluteUrl(url) {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  const normalizedPath = url.replace(/^\/+/, "");

  if (PROJECT111_IMAGE_BASE === "/") {
    return `/${normalizedPath}`;
  }

  if (PROJECT111_IMAGE_BASE.startsWith("/")) {
    return `${PROJECT111_IMAGE_BASE}${normalizedPath}`;
  }

  return `${PROJECT111_IMAGE_BASE}${normalizedPath}`;
}

function formatMilliliters(value) {
  return value && value > 0 ? `${value} мл` : null;
}

function formatKilograms(value) {
  return value && value > 0 ? `${value.toLocaleString("ru-RU", { maximumFractionDigits: 3 })} кг` : null;
}

function formatCubicMeters(value) {
  return value && value > 0 ? `${value.toLocaleString("ru-RU", { maximumFractionDigits: 3 })} м³` : null;
}

function formatDimensions(size) {
  const dimensions = [size?.width, size?.length, size?.height].filter((value) => typeof value === "number" && value > 0);
  return dimensions.length > 0 ? `${dimensions.join(" × ")} мм` : null;
}

function resolvePortobelloProductSizeLabel(product) {
  if (product.sizeClothing?.trim()) {
    return product.sizeClothing.trim();
  }

  if (product.format?.trim()) {
    return product.format.trim();
  }

  return formatDimensions(product.size);
}

function formatPortobelloMaterials(product) {
  const materials = [product.material1, product.material2, product.material3, product.material4].filter((value) => Boolean(value?.trim()));
  return materials.length > 0 ? materials.join(", ") : null;
}

function buildPortobelloAttributes(product) {
  const orderedAttributes = [
    ["Бренд", product.brand],
    ["Коллекция", product.collection],
    ["Размер изделия", resolvePortobelloProductSizeLabel(product) ?? "Не указан"],
    ["Формат", product.format],
    ["Материалы", formatPortobelloMaterials(product)],
    ["Габариты упаковки", formatDimensions(product.size) ?? "Не указаны"],
    ["Объем", formatMilliliters(product.volumeMl)],
    ["Вес изделия", formatKilograms(product.weight)],
    ["Вес коробки", formatKilograms(product.boxWeight)],
    ["Объем коробки", formatCubicMeters(product.boxVolume)],
    ["В упаковке", product.quantityInPackage && product.quantityInPackage > 0 ? `${product.quantityInPackage} шт.` : null],
    ["Обложка", product.cover],
    ["Размер блока", product.blockSize],
    ["Страниц", product.numberOfPages && product.numberOfPages > 0 ? String(product.numberOfPages) : null],
    ["Вместимость", product.capacity && product.capacity > 0 ? String(product.capacity) : null],
    ["Покрытие", product.coating],
    ["Плотность", product.density],
    ["Пол", product.gender],
    ["Карман", product.pocket ? "Есть" : null],
    ["Обязательная маркировка", product.mandatoryMarking ? "Требуется" : null],
  ];

  return orderedAttributes
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }));
}

function getPortobelloBaseArticle(article) {
  return article.split(".").filter(Boolean)[0] ?? article;
}

function stripPortobelloSizeFromTitle(title) {
  return title.replace(/,\s*размер\s+[^,]+$/i, "").replace(/\s{2,}/g, " ").trim();
}

function getPortobelloPrimaryImage(product) {
  return product.images?.find(Boolean) ?? PORTOBELLO_IMAGE_FALLBACK;
}

function getPortobelloAllImages(product) {
  const imageUrls = product.images?.filter(Boolean) ?? [];
  return imageUrls.length > 0 ? imageUrls : [getPortobelloPrimaryImage(product)];
}

function getPortobelloColorLabel(product, fallbackCode) {
  const labels = [product.color1, product.color2, product.color3, product.color4, product.color5, product.color6].filter(Boolean);
  return labels.join(", ") || fallbackCode;
}

function buildCategoryIndex(config) {
  const categories = [];
  const rootById = new Map();
  const childById = new Map();
  const matchers = [];

  for (const root of config.categories) {
    const nextRoot = {
      id: root.id,
      name: root.name,
      children: [],
    };

    rootById.set(root.id, nextRoot);
    categories.push(nextRoot);

    for (const child of root.children) {
      const nextChild = {
        id: child.id,
        name: child.name,
        rootId: root.id,
        rootName: root.name,
      };

      nextRoot.children.push(nextChild);
      childById.set(child.id, nextChild);
      matchers.push({
        ...nextChild,
        portobelloSectionIds: new Set(child.portobelloSectionIds ?? []),
        project111PageIds: new Set(child.project111PageIds ?? []),
        portobelloAliases: (child.portobelloAliases ?? []).map(normalizeText),
        portobelloRootAliases: (child.portobelloRootAliases ?? []).map(normalizeText),
        project111Aliases: (child.project111Aliases ?? []).map(normalizeText),
        project111RootAliases: (child.project111RootAliases ?? []).map(normalizeText),
      });
    }
  }

  const fallbackRoot = {
    id: config.fallbackRoot.id,
    name: config.fallbackRoot.name,
    children: [],
  };
  const fallbackChild = {
    id: config.fallbackChild.id,
    name: config.fallbackChild.name,
    rootId: fallbackRoot.id,
    rootName: fallbackRoot.name,
  };

  fallbackRoot.children.push(fallbackChild);
  categories.push(fallbackRoot);
  rootById.set(fallbackRoot.id, fallbackRoot);
  childById.set(fallbackChild.id, fallbackChild);

  return {
    categories,
    rootById,
    childById,
    matchers,
    fallbackRoot,
    fallbackChild,
  };
}

function includesAlias(normalizedValue, aliases) {
  return aliases.some((alias) => normalizedValue.includes(alias));
}

function matchUnifiedCategory(index, source, category) {
  const normalizedRootName = normalizeText(category.rootName ?? "");
  const normalizedChildName = normalizeText(category.childName ?? "");

  for (const matcher of index.matchers) {
    if (source === "portobello") {
      if (category.childId && matcher.portobelloSectionIds.has(category.childId)) {
        return matcher;
      }

      if (normalizedChildName && includesAlias(normalizedChildName, matcher.portobelloAliases)) {
        return matcher;
      }

      if (normalizedRootName && includesAlias(normalizedRootName, matcher.portobelloRootAliases)) {
        return matcher;
      }

      continue;
    }

    if (category.childId && matcher.project111PageIds.has(category.childId)) {
      return matcher;
    }

    if (normalizedChildName && includesAlias(normalizedChildName, matcher.project111Aliases)) {
      return matcher;
    }

    if (normalizedRootName && includesAlias(normalizedRootName, matcher.project111RootAliases)) {
      return matcher;
    }
  }

  return index.fallbackChild;
}

function buildCategoryStats(index, products) {
  const productCountByChildId = new Map();

  for (const product of products) {
    productCountByChildId.set(product.sectionId, (productCountByChildId.get(product.sectionId) ?? 0) + 1);
  }

  return index.categories
    .map((root) => {
      const children = root.children
        .map((child) => ({
          id: child.id,
          name: child.name,
          productCount: productCountByChildId.get(child.id) ?? 0,
        }))
        .filter((child) => child.productCount > 0);

      const productCount = children.reduce((sum, child) => sum + child.productCount, 0);

      return {
        id: root.id,
        name: root.name,
        productCount,
        children,
      };
    })
    .filter((root) => root.productCount > 0);
}

function parsePortobelloDataset(index) {
  const catalog = readJson(join(process.cwd(), "public", "_temp", "catalog.json"));
  const prices = readJson(join(process.cwd(), "public", "_temp", "prices.json"));
  const stocks = readJson(join(process.cwd(), "public", "_temp", "stocks.json"));

  const sections = Array.isArray(catalog.sections) ? catalog.sections : Object.values(catalog.sections);
  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const priceByProductId = new Map(prices.prices.map((price) => [price.productId, price]));
  const stockByProductId = new Map();

  for (const stock of stocks.stocks) {
    const nextQuantity = stock.availableQuantity ?? stock.quantity ?? 0;
    stockByProductId.set(stock.productId, (stockByProductId.get(stock.productId) ?? 0) + nextQuantity);
  }

  const groupedProducts = new Map();
  const unmappedCategories = new Map();

  for (const product of catalog.products) {
    const sourceChild = sectionById.get(product.sectionId);
    const sourceRoot = sourceChild?.parentId ? sectionById.get(sourceChild.parentId) : null;
    const matchedChild = matchUnifiedCategory(index, "portobello", {
      rootName: sourceRoot?.name ?? sourceChild?.name ?? "Portobello",
      childName: sourceChild?.name ?? sourceRoot?.name ?? "Portobello",
      childId: sourceChild?.id ?? null,
    });

    if (matchedChild.id === index.fallbackChild.id) {
      const fallbackKey = `${sourceRoot?.name ?? "Без корня"} / ${sourceChild?.name ?? "Без раздела"}`;
      unmappedCategories.set(fallbackKey, (unmappedCategories.get(fallbackKey) ?? 0) + 1);
    }

    const groupId = `${matchedChild.id}:${product.sectionId}:${getPortobelloBaseArticle(product.article)}`;
    const variantKey = product.article;
    const existingGroup = groupedProducts.get(groupId) ?? {
      id: `portobello:${groupId}`,
      source: "portobello",
      sourceGroupId: groupId,
      sourceCategory: {
        rootId: sourceRoot?.id ?? null,
        rootName: sourceRoot?.name ?? sourceChild?.name ?? "Portobello",
        childId: sourceChild?.id ?? null,
        childName: sourceChild?.name ?? sourceRoot?.name ?? "Portobello",
      },
      unifiedCategory: {
        rootId: matchedChild.rootId,
        rootName: matchedChild.rootName,
        childId: matchedChild.id,
        childName: matchedChild.name,
      },
      variants: new Map(),
    };
    const variantItems = existingGroup.variants.get(variantKey) ?? [];
    variantItems.push(product);
    existingGroup.variants.set(variantKey, variantItems);
    groupedProducts.set(groupId, existingGroup);
  }

  const products = [...groupedProducts.values()]
    .map((group) => {
      const variants = [...group.variants.entries()]
        .map(([variantKey, items]) => {
          const representative =
            items.find((item) => !item.sizeClothing && priceByProductId.has(item.id)) ??
            items.find((item) => !item.sizeClothing) ??
            items.find((item) => priceByProductId.has(item.id)) ??
            items[0];

          if (!representative) {
            return null;
          }

          const priceSource = priceByProductId.get(representative.id) ?? items.map((item) => priceByProductId.get(item.id)).find(Boolean);

          if (!priceSource) {
            return null;
          }

          const stock =
            (!representative.sizeClothing && stockByProductId.has(representative.id))
              ? stockByProductId.get(representative.id) ?? 0
              : items.reduce((sum, item) => sum + (stockByProductId.get(item.id) ?? 0), 0);

          return {
            id: `portobello:${representative.id}`,
            source: "portobello",
            sourceProductId: representative.id,
            article: representative.article,
            title: stripPortobelloSizeFromTitle(representative.name),
            imageUrl: getPortobelloPrimaryImage(representative),
            imageUrls: getPortobelloAllImages(representative),
            colorCode: variantKey,
            colorLabel: getPortobelloColorLabel(representative, variantKey),
            priceRub: priceSource.price,
            discountPriceRub: priceSource.discountPrice,
            stock,
            sizeLabel: representative.sizeClothing?.trim() || null,
          };
        })
        .filter(Boolean)
        .sort((left, right) => compareRu(left.article, right.article));

      if (variants.length === 0) {
        return null;
      }

      const representative = group.variants.get(variants[0].article)?.[0] ?? [...group.variants.values()][0]?.[0];

      return {
        id: group.id,
        source: "portobello",
        sectionId: group.unifiedCategory.childId,
        rootSectionId: group.unifiedCategory.rootId,
        title: representative?.collection?.trim() || representative?.name?.trim() || variants[0].title,
        descriptionHtml: representative?.description?.trim() || null,
        imageUrls: representative ? getPortobelloAllImages(representative) : [variants[0].imageUrl],
        brand: representative?.brand?.trim() || null,
        attributes: representative ? buildPortobelloAttributes(representative) : [],
        layoutPdf: representative?.layoutPdf?.trim() || null,
        fileAboutBlock: representative?.fileAboutBlock?.trim() || null,
        sourceCategory: group.sourceCategory,
        unifiedCategory: group.unifiedCategory,
        variants,
      };
    })
    .filter(Boolean)
    .sort((left, right) => compareRu(left.title, right.title));

  return {
    products,
    stats: {
      rawProducts: catalog.products.length,
      mergedProducts: products.length,
      variants: products.reduce((sum, product) => sum + product.variants.length, 0),
      unmappedCategories: [...unmappedCategories.entries()].map(([name, productCount]) => ({ name, productCount })),
    },
  };
}

function parseProject111Tree() {
  const xml = readText(join(process.cwd(), "public", "project111", "tree.xml"));
  const pageRe = /<page(?: parent_page_id="([^"]+)")?>\s*<page_id>([^<]+)<\/page_id>\s*<name>([^<]+)<\/name>/g;
  const productRefRe = /<product>\s*<page>([^<]+)<\/page>\s*<product>([^<]+)<\/product>\s*<\/product>/g;
  const pages = [];

  for (const match of xml.matchAll(pageRe)) {
    pages.push({
      id: match[2],
      name: decodeXmlEntities(match[3]).trim(),
      parentId: match[1] ?? null,
    });
  }

  const pageById = new Map(pages.map((page) => [page.id, page]));
  const topLevelPages = pages.filter((page) => page.parentId === "1");
  const childPages = pages.filter((page) => page.parentId && page.parentId !== "1");
  const rootByChildId = new Map();

  for (const childPage of childPages) {
    const rootPage = pageById.get(childPage.parentId);

    if (rootPage) {
      rootByChildId.set(childPage.id, rootPage);
    }
  }

  const pageIdsByProductId = new Map();

  for (const match of xml.matchAll(productRefRe)) {
    const pageId = match[1].trim();
    const productId = match[2].trim();
    const current = pageIdsByProductId.get(productId) ?? [];
    current.push(pageId);
    pageIdsByProductId.set(productId, current);
  }

  return {
    pageById,
    topLevelPages,
    rootByChildId,
    pageIdsByProductId,
  };
}

function getProject111Images(block) {
  const images = [];
  const imageKeys = new Set();
  const superBigImage = getTagAttrValue(block, "super_big_image", "src");
  const bigImage = getTagAttrValue(block, "big_image", "src");
  const smallImage = getTagAttrValue(block, "small_image", "src");
  const galleryImages = getAllTagValues(block, "image");

  function getImageKey(url) {
    return url.replace(/_(?:200x200|1000x1000)(\.[a-z0-9]+)$/i, "$1");
  }

  for (const image of [superBigImage, ...galleryImages, bigImage]) {
    const absolute = ensureAbsoluteUrl(image);
    const imageKey = absolute ? getImageKey(absolute) : null;

    if (absolute && imageKey && !imageKeys.has(imageKey)) {
      images.push(absolute);
      imageKeys.add(imageKey);
    }
  }

  // Use the 200x200 image only as a last-resort fallback, not as a gallery slide.
  const fallbackSmallImage = ensureAbsoluteUrl(smallImage);
  const fallbackSmallImageKey = fallbackSmallImage ? getImageKey(fallbackSmallImage) : null;

  if (images.length === 0 && fallbackSmallImage && fallbackSmallImageKey && !imageKeys.has(fallbackSmallImageKey)) {
    images.push(fallbackSmallImage);
    imageKeys.add(fallbackSmallImageKey);
  }

  return images;
}

function buildProject111Attributes(product) {
  const dimensions = formatProject111PackagingDimensions(product.packagingSize);
  const orderedAttributes = [
    ["Бренд", product.brand],
    ["Размер", product.productSize],
    ["Материал", product.material],
    ["Вес изделия", formatKilograms(product.weightKg)],
    ["MOQ", product.moq ? `${product.moq} шт.` : null],
    ["Срок поставки", product.days ? `${product.days} дн.` : null],
    ["В упаковке", product.packAmount ? `${product.packAmount} шт.` : null],
    ["Вес упаковки", formatKilograms(product.packWeightKg)],
    ["Объем упаковки", formatProject111Volume(product.packVolumeM3)],
    ["Габариты упаковки", dimensions],
    ["Статус", product.status],
  ];

  return orderedAttributes
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value }));
}

function formatProject111PackagingDimensions(size) {
  const dimensions = [size?.width, size?.length, size?.height].filter((value) => typeof value === "number" && value > 0);
  return dimensions.length > 0 ? `${dimensions.join(" × ")} см` : null;
}

function formatProject111Volume(value) {
  return value && value > 0 ? `${value.toLocaleString("ru-RU", { maximumFractionDigits: 4 })} м³` : null;
}

function deriveProject111ColorLabel(productName, groupName, fallbackArticle) {
  const normalizedName = productName.trim();
  const escapedGroupName = escapeRegExp(groupName.trim());
  const prefixes = [
    new RegExp(`^${escapedGroupName}\\s*,\\s*`, "i"),
    new RegExp(`^${escapedGroupName}\\s+`, "i"),
  ];

  for (const prefix of prefixes) {
    const withoutPrefix = normalizedName.replace(prefix, "").trim();

    if (withoutPrefix && withoutPrefix !== normalizedName) {
      return withoutPrefix;
    }
  }

  return fallbackArticle;
}

function parseProject111Stock() {
  const xml = readText(join(process.cwd(), "public", "project111", "stock.xml"));
  const stockBlocks = [...xml.matchAll(/<stock>([\s\S]*?)<\/stock>/g)];
  const stockByProductId = new Map();

  for (const [, blockContent] of stockBlocks) {
    const block = `<stock>${blockContent}</stock>`;
    const productId = getTagValue(block, "product_id");

    if (!productId) {
      continue;
    }

    stockByProductId.set(productId, {
      stock: parseNumber(getTagValue(block, "free")) ?? parseNumber(getTagValue(block, "amount")) ?? 0,
      priceRub: parseNumber(getTagValue(block, "enduserprice")),
      dealerPriceRub: parseNumber(getTagValue(block, "dealerprice")),
    });
  }

  return stockByProductId;
}

function parseProject111Dataset(index) {
  const { pageById, rootByChildId, pageIdsByProductId } = parseProject111Tree();
  const stockByProductId = parseProject111Stock();
  const catalogueXml = readText(join(process.cwd(), "public", "project111", "catalogue.xml"));
  const topLevelProducts = extractNestedBlocks(catalogueXml, "product");
  const groupedProducts = new Map();
  const unmappedCategories = new Map();

  for (const block of topLevelProducts) {
    const topLevelOnlyBlock = removeNestedProductBlocks(block);
    const topProductId = getTagValue(topLevelOnlyBlock, "product_id");
    const code = getTagValue(topLevelOnlyBlock, "code");
    const groupId = getTagValue(topLevelOnlyBlock, "group");
    const groupName = getTagValue(topLevelOnlyBlock, "groupname");
    const productName = getTagValue(topLevelOnlyBlock, "name");

    if (!topProductId || !groupName || !productName || !code) {
      continue;
    }

    const pageIds = pageIdsByProductId.get(topProductId) ?? [];
    const resolvedPage =
      pageIds
        .map((pageId) => pageById.get(pageId))
        .find((page) => page && rootByChildId.has(page.id)) ?? null;
    const resolvedRoot = resolvedPage ? rootByChildId.get(resolvedPage.id) ?? null : null;
    const matchedChild = matchUnifiedCategory(index, "project111", {
      rootName: resolvedRoot?.name ?? "Project111",
      childName: resolvedPage?.name ?? resolvedRoot?.name ?? "Project111",
      childId: resolvedPage?.id ?? null,
    });

    if (matchedChild.id === index.fallbackChild.id) {
      const fallbackKey = `${resolvedRoot?.name ?? "Без корня"} / ${resolvedPage?.name ?? "Без раздела"}`;
      unmappedCategories.set(fallbackKey, (unmappedCategories.get(fallbackKey) ?? 0) + 1);
    }

    const variantBlocks = getChildProductBlocks(block);
    const nestedVariants = variantBlocks.map((variantBlock) => ({
      productId: getTagValue(variantBlock, "product_id"),
      article: getTagValue(variantBlock, "code"),
      title: getTagValue(variantBlock, "name"),
      sizeCode: getTagValue(variantBlock, "size_code"),
      priceRub: parseNumber(getTagValue(variantBlock, "price")),
    }));

    const topProduct = {
      productId: topProductId,
      article: code,
      title: productName,
      groupId: groupId ?? topProductId,
      groupName,
      brand: getTagValue(topLevelOnlyBlock, "brand"),
      productSize: getTagValue(topLevelOnlyBlock, "product_size"),
      material: getTagValue(topLevelOnlyBlock, "matherial"),
      descriptionHtml: getTagValue(topLevelOnlyBlock, "content"),
      images: getProject111Images(topLevelOnlyBlock),
      weightKg: (() => {
        const value = parseNumber(getTagValue(topLevelOnlyBlock, "weight"));
        return value ? value / 1000 : null;
      })(),
      ondemand: getTagValue(topLevelOnlyBlock, "ondemand"),
      moq: parseNumber(getTagValue(topLevelOnlyBlock, "moq")),
      days: parseNumber(getTagValue(topLevelOnlyBlock, "days")),
      status: getTagValue(topLevelOnlyBlock, "status"),
      packAmount: parseNumber(getNestedTagValue(topLevelOnlyBlock, "pack", "amount")),
      packWeightKg: (() => {
        const value = parseNumber(getNestedTagValue(topLevelOnlyBlock, "pack", "weight"));
        return value ? value / 1000 : null;
      })(),
      packVolumeM3: (() => {
        const value = parseNumber(getNestedTagValue(topLevelOnlyBlock, "pack", "volume"));
        return value ? value / 1_000_000 : null;
      })(),
      packagingSize: {
        width: parseNumber(getNestedTagValue(topLevelOnlyBlock, "pack", "sizex")),
        length: parseNumber(getNestedTagValue(topLevelOnlyBlock, "pack", "sizey")),
        height: parseNumber(getNestedTagValue(topLevelOnlyBlock, "pack", "sizez")),
      },
      nestedVariants,
    };

    const mergedGroupKey = `${matchedChild.id}:${topProduct.groupId}`;
    const existingGroup = groupedProducts.get(mergedGroupKey) ?? {
      id: `project111:${mergedGroupKey}`,
      source: "project111",
      sourceGroupId: topProduct.groupId,
      sourceCategory: {
        rootId: resolvedRoot?.id ?? null,
        rootName: resolvedRoot?.name ?? "Project111",
        childId: resolvedPage?.id ?? null,
        childName: resolvedPage?.name ?? "Project111",
      },
      unifiedCategory: {
        rootId: matchedChild.rootId,
        rootName: matchedChild.rootName,
        childId: matchedChild.id,
        childName: matchedChild.name,
      },
      products: [],
    };

    existingGroup.products.push(topProduct);
    groupedProducts.set(mergedGroupKey, existingGroup);
  }

  const products = [...groupedProducts.values()]
    .map((group) => {
      const variants = group.products
        .map((product) => {
          const stockCandidates = product.nestedVariants.length > 0 ? product.nestedVariants : [{ productId: product.productId, priceRub: null }];
          const stock = stockCandidates.reduce((sum, item) => sum + (stockByProductId.get(item.productId)?.stock ?? 0), 0);
          const firstStockSource = stockCandidates
            .map((item) => stockByProductId.get(item.productId))
            .find(Boolean);
          const priceRub =
            firstStockSource?.priceRub ??
            product.nestedVariants.find((item) => typeof item.priceRub === "number")?.priceRub ??
            stockByProductId.get(product.productId)?.priceRub ??
            0;

          return {
            id: `project111:${product.productId}`,
            source: "project111",
            sourceProductId: product.productId,
            article: product.article,
            title: product.title,
            imageUrl: product.images[0] ?? PORTOBELLO_IMAGE_FALLBACK,
            imageUrls: product.images.length > 0 ? product.images : [PORTOBELLO_IMAGE_FALLBACK],
            colorCode: product.article,
            colorLabel: deriveProject111ColorLabel(product.title, product.groupName, product.article),
            priceRub,
            discountPriceRub: null,
            stock,
            sizeLabel: product.productSize,
            nestedVariants: product.nestedVariants
              .filter((item) => item.productId)
              .map((item) => ({
                id: item.productId,
                article: item.article,
                title: item.title,
                sizeCode: item.sizeCode,
                stock: stockByProductId.get(item.productId)?.stock ?? 0,
                priceRub: stockByProductId.get(item.productId)?.priceRub ?? item.priceRub ?? priceRub,
              })),
          };
        })
        .filter((variant) => variant.priceRub > 0)
        .sort((left, right) => compareRu(left.article, right.article));

      if (variants.length === 0) {
        return null;
      }

      const representative = group.products[0];

      return {
        id: group.id,
        source: "project111",
        sectionId: group.unifiedCategory.childId,
        rootSectionId: group.unifiedCategory.rootId,
        title: representative.groupName,
        descriptionHtml: representative.descriptionHtml?.trim() || null,
        imageUrls: representative.images.length > 0 ? representative.images : [variants[0].imageUrl],
        brand: representative.brand?.trim() || null,
        attributes: buildProject111Attributes(representative),
        layoutPdf: null,
        fileAboutBlock: null,
        sourceCategory: group.sourceCategory,
        unifiedCategory: group.unifiedCategory,
        variants,
      };
    })
    .filter(Boolean)
    .sort((left, right) => compareRu(left.title, right.title));

  return {
    products,
    stats: {
      rawProducts: topLevelProducts.length,
      mergedProducts: products.length,
      variants: products.reduce((sum, product) => sum + product.variants.length, 0),
      unmappedCategories: [...unmappedCategories.entries()].map(([name, productCount]) => ({ name, productCount })),
    },
  };
}

function buildMergedCatalog() {
  const categoryIndex = buildCategoryIndex(MERGED_CATALOG_CONFIG);
  const portobello = parsePortobelloDataset(categoryIndex);
  const project111 = parseProject111Dataset(categoryIndex);
  const products = [...portobello.products, ...project111.products]
    .filter((product) => product.sectionId !== categoryIndex.fallbackChild.id)
    .sort((left, right) => {
    if (left.rootSectionId !== right.rootSectionId) {
      return compareRu(left.unifiedCategory.rootName, right.unifiedCategory.rootName);
    }

    if (left.sectionId !== right.sectionId) {
      return compareRu(left.unifiedCategory.childName, right.unifiedCategory.childName);
    }

    return compareRu(left.title, right.title);
    });
  const categories = buildCategoryStats(categoryIndex, products);

  return {
    generatedAt: new Date().toISOString(),
    sources: {
      portobello: portobello.stats,
      project111: project111.stats,
    },
    categories,
    products,
    stats: {
      totalProducts: products.length,
      totalVariants: products.reduce((sum, product) => sum + product.variants.length, 0),
      categoryCount: categories.length,
      childCategoryCount: categories.reduce((sum, root) => sum + root.children.length, 0),
    },
  };
}

const mergedCatalog = buildMergedCatalog();
writeJson(OUTPUT_FILE, mergedCatalog);

console.log(
  JSON.stringify(
    {
      outputFile: OUTPUT_FILE,
      project111ImageBase: PROJECT111_IMAGE_BASE,
      totalProducts: mergedCatalog.stats.totalProducts,
      totalVariants: mergedCatalog.stats.totalVariants,
      categories: mergedCatalog.categories.map((category) => ({
        id: category.id,
        productCount: category.productCount,
      })),
      portobelloUnmapped: mergedCatalog.sources.portobello.unmappedCategories.length,
      project111Unmapped: mergedCatalog.sources.project111.unmappedCategories.length,
    },
    null,
    2,
  ),
);
