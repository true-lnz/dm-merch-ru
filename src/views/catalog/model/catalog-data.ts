export type CatalogProductItem = {
  title: string;
  description: string;
  imageUrl: string;
};

export type CatalogCaseImage = {
  src: string;
  alt: string;
};

export type CatalogCaseItem = {
  id: string;
  company: string;
  description: string;
  result: string;
  images: CatalogCaseImage[];
};

export type CatalogPageData = {
  heroTitle: string;
  heroImage: {
    src: string;
    alt: string;
  };
  showProductsSubheading?: boolean;
  products: CatalogProductItem[];
  casesTitle: string;
  cases: CatalogCaseItem[];
  casesVariant?: "default" | "stacked";
};

const CASE_PLACEHOLDER_IMAGES: [CatalogCaseImage, CatalogCaseImage] = [
  { src: "/catalog/cases/img_dark_square.png", alt: "Кейс, фото 1" },
  { src: "/catalog/cases/img_dark_tall.png", alt: "Кейс, фото 2" },
];

export const MAIN_CATALOG_DATA: CatalogPageData = {
  heroTitle: "КАТАЛОГ",
  heroImage: {
    src: "/catalog/covers/img_main_catalog_cover.png",
    alt: "Команда в фирменном мерче",
  },
  showProductsSubheading: true,
  products: [
    { title: "Футболки и поло", description: "От 450 ₽", imageUrl: "/catalog/main-catalog/products/img_1_futbolki.png" },
    { title: "толстовки", description: "От 870 ₽", imageUrl: "/catalog/main-catalog/products/img_2_tolstovki.png" },
    { title: "верхняя одежда", description: "От 870 ₽", imageUrl: "/catalog/main-catalog/products/img_3_verhnya_odezhda.png" },
    { title: "брюки", description: "От 900 ₽", imageUrl: "/catalog/main-catalog/products/img_4_bryki.png" },
    { title: "спортивная одежда", description: "От 900 ₽", imageUrl: "/catalog/main-catalog/products/img_5_sport_wear.png" },
    { title: "головные уборы", description: "От 450 ₽", imageUrl: "/catalog/main-catalog/products/img_6_hats.png" },
    { title: "сумки и рюкзаки", description: "От 150 ₽", imageUrl: "/catalog/main-catalog/products/img_7_sumki.png" },
    { title: "Сувенирная продукция", description: "От 300 ₽", imageUrl: "/catalog/main-catalog/products/img_8_souvenir.png" },
    { title: "Авторская сувенирная продукция", description: "От 550 ₽", imageUrl: "/catalog/main-catalog/products/img_9_author_souvenir.png" },
    { title: "Деловые аксессуары", description: "От 550 ₽", imageUrl: "/catalog/main-catalog/products/img_10_buz_accessories.png" },
    { title: "Униформа", description: "От 750 ₽", imageUrl: "/catalog/main-catalog/products/img_11_uniform.png" },
  ],
  casesTitle: "Примеры\nреализованных работ",
  cases: [
    {
      id: "kolchuga",
      company: "КОЛЬЧУГА",
      description: "Разработали и произвели худи и футболки с деликатным брендированием для сотрудников и корпоративного использования.",
      result: "Практичный мерч на каждый день, который поддерживает фирменный стиль компании и остаётся удобным в носке.",
      images: [
        { src: "/catalog/cases/img_kolchuga_square.jpg", alt: "Кольчуга — кейс, фото 1" },
        { src: "/catalog/cases/img_kolchuga_tall.jpg", alt: "Кольчуга — кейс, фото 2" },
      ],
    },
    {
      id: "tihii-dom",
      company: "ТИХИЙ ДОМ",
      description: "Создали корпоративный набор с цельной визуальной концепцией, в котором каждая деталь работает на образ бренда.",
      result: "Эстетичный фирменный подарок для клиентов и партнёров, который приятно дарить и легко ассоциировать с брендом.",
      images: [
        { src: "/catalog/cases/img_tihii_dom_square.jpg", alt: "Тихий дом — кейс, фото 1" },
        { src: "/catalog/cases/img_tihii_dom_tall.jpg", alt: "Тихий дом — кейс, фото 2" },
      ],
    },
  ],
};

export const CATEGORY_CATALOG_DATA: Record<string, CatalogPageData> = {
  futbolki: {
    heroTitle: "ФУТБОЛКИ\nДЛЯ БРЕНДИРОВАНИЯ",
    heroImage: {
      src: "/catalog/covers/img_t_shirts_catalog_cover.png",
      alt: "Футболки для брендирования",
    },
    products: [
      {
        title: "Футболка стандарт",
        description: "Узбекистан\nКачество: ринг\nПлотность: 180 гр/метр²\n\nОт 390 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_standart_2.png",
      },
      {
        title: "Футболка \nоверсайз",
        description: "Узбекистан\nКачество: ринг\nПлотность: 180 гр/метр²\n\nОт 440 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_oversayz.png",
      },
      {
        title: "Футболка \nстандарт",
        description: "Турция\nКачество: пенье\nПлотность: 200 гр/метр²\n\nОт 1170 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_standart.png",
      },
      {
        title: "Футболка \nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 200 гр/метр²\n\nОт 1270 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_oversayz_2.png",
      },
      {
        title: "Футболка оверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 230 гр/метр²\n\nОт 1370 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_oversayz_3.png",
      },
      {
        title: "Футболка \nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 300 гр/метр²\n\nОт 1670 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_oversayz_4.png",
      },
      {
        title: "Футболка \nполо",
        description: "Турция\nКачество: пенье\nПлотность: 220 гр/метр²\n\nОт 1370 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_polo.png",
      },
      {
        title: "Футболка поло \nна замке",
        description: "Турция\nКачество: пенье\nПлотность: 220 гр/метр²\n\nОт 1470 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_futbolka_polo_na_zamke.png",
      },
      {
        title: "поло с длинным рукавом",
        description: "Турция\nКачество: пенье\nПлотность: 220 гр/метр²\n\nОт 1470 ₽",
        imageUrl: "/catalog/t-shirt-catalog/products/img_polo_s_dlinnym_rukavom.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "magadan-estfest",
        company: "Магадан × ЕстьФест",
        description: "Разработали коллекцию мерча\nдля сотрудников ресторана «Магадан»\nв рамках фестиваля.",
        result: "Стильная униформа, которая усиливает бренд ресторана и формирует премиальный сервисный образ.",
        images: [
          { src: "/catalog/cases/img_magadan_square.png", alt: "Магадан — кейс, фото 1" },
          { src: "/catalog/cases/img_magadan_tall.png", alt: "Магадан — кейс, фото 2" },
        ],
      },
      {
        id: "art-kvadrat",
        company: "АРТ-КВАДРАТ",
        description: "Разработали дизайн-концепт, который передает атмосферу городского пространства: события, развлечения, культурные активности.",
        result: "Мерч, который стал частью идентичности пространства и усилил эмоциональную связь с аудиторией.",
        images: [
          { src: "/catalog/cases/img_art_kvadrat_square.png", alt: "АРТ-КВАДРАТ — кейс, фото 1" },
          { src: "/catalog/cases/img_art_kvadrat_tall.png", alt: "АРТ-КВАДРАТ — кейс, фото 2" },
        ],
      },
    ],
  },
  tolstovki: {
    heroTitle: "Толстовки\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_sweatshirt_catalog_cover.png",
      alt: "Толстовки для брендирования",
    },
    products: [
      {
        title: "Худи\nстандарт",
        description: "Узбекистан\nКачество: ринг\nПлотность: 220 гр/метр²\n\nОт 1270 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_5.png",
      },
      {
        title: "Худи\nоверсайз",
        description: "Узбекистан\nКачество: ринг\nПлотность: 320 гр/метр²\n\nОт 1370 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_13.png",
      },
      {
        title: "Худи\nстандарт",
        description: "Турция\nКачество: пенье\nПлотность: 350 гр/метр²\n\nОт 1670 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_14.png",
      },
      {
        title: "Худи\nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 380 гр/метр²\n\nОт 1770 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_15.png",
      },
      {
        title: "Худи\nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 500 гр/метр²\n\nОт 1970 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_16.png",
      },
      {
        title: "Свитшот \nстандарт",
        description: "Узбекистан\nКачество: ринг\nПлотность: 320 гр/метр²\n\nОт 1170 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_17.png",
      },
      {
        title: "Свитшот \nстандарт",
        description: "Турция\nКачество: пенье\nПлотность: 350 гр/метр²\n\nОт 1470 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_18.png",
      },
      {
        title: "Свитшот \nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 380 гр/метр²\n\nОт 1570 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_19.png",
      },
      {
        title: "Толстовки \nна молнии",
        description: "Турция\nКачество: пенье\nПлотность: 380 гр/метр²\n\nОт 1670 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_20.png",
      },
      {
        title: "Лонгслив \nстандарт",
        description: "Турция\nКачество: пенье\nПлотность: 200 гр/метр²\n\nОт 1170 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_21.png",
      },
      {
        title: "Лонгслив\nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 200 гр/метр²\n\nОт 1270 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_22.png",
      },
      {
        title: "Лонгслив\nоверсайз",
        description: "Турция\nКачество: пенье\nПлотность: 230 гр/метр²\n\nОт 1370 ₽",
        imageUrl: "/catalog/sweatshirt-catalog/products/img_23.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "dark",
        company: "DARK",
        description: "Разработали мерч-наборы: футболки, худи и светоотражающие элементы\nв фирменной стилистике бренда.",
        result: "Современный и функциональный мерч\nдля команды, усиливающий бренд работодателя.",
        images: [
          { src: "/catalog/cases/img_dark_square.png", alt: "DARK — кейс, фото 1" },
          { src: "/catalog/cases/img_dark_tall.png", alt: "DARK — кейс, фото 2" },
        ],
      },
      {
        id: "ufanet",
        company: "Уфанет",
        description: "Создали коллекцию худи, полностью соответствующую фирменному стилю компании.",
        result: "Единый корпоративный стиль\nи визуальная узнаваемость бренда.",
        images: [
          { src: "/catalog/cases/img_ufanet_square.png", alt: "Уфанет — кейс, фото 1" },
          { src: "/catalog/cases/img_ufanet_tall.png", alt: "Уфанет — кейс, фото 2" },
        ],
      },
    ],
  },
  "verhnyaya-odezhda": {
    heroTitle: "Верхняя одежда\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_outdoor_catalog_cover.png",
      alt: "Верхняя одежда для брендирования",
    },
    products: [
      {
        title: "Бомберы",
        description: "Материал: карточная плащевая\nСостав: 100 % полиэстер\nПлотность 200 гр/метр²\n\nОт 3970 ₽",
        imageUrl: "/catalog/outdoor-catalog/products/img_bombery.png",
      },
      {
        title: "Дождевики",
        description: "Материал: полиэстер\nСостав: 100 % полиэстер\nПлотность: 60 гр/метр²\n\nОт 1490 ₽",
        imageUrl: "/catalog/outdoor-catalog/products/img_dozhdeviki.png",
      },
      {
        title: "флисовые куртки",
        description: "Материал: флис\nСостав: 100 % флис\nПлотность: 220 гр/метр²\n\nОт 1670 ₽",
        imageUrl: "/catalog/outdoor-catalog/products/img_flisovye_kurtki.png",
      },
      {
        title: "Жилеты",
        description: "Материал: полиэстер\nСостав: 100 % полиэстер, утеплитель - синтепон\nПлотность: 250 гр/метр²\n\nОт 1970 ₽",
        imageUrl: "/catalog/outdoor-catalog/products/img_zhilety.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "ldgr-estfest",
        company: "LDGR × ЕстьФест",
        description:
          "Произвели партию брендированных дождевиков для команды партнёра гастрономического фестиваля.\nВ дизайне учли фирменную айдентику LDGR и требования к практичности экипировки для уличных мероприятий.",
        result: "Функциональную экипировку\nдля команды и дополнительную визуальную экспозицию бренда\nна фестивале.",
        images: [
          { src: "/catalog/cases/img_ldgr_square.png", alt: "LDGR — кейс, фото 1" },
          { src: "/catalog/cases/img_ldgr_tall.png", alt: "LDGR — кейс, фото 2" },
        ],
      },
      {
        id: "agromig",
        company: "Агромиг",
        description:
          "Разработали и изготовили дождевики\nс фирменной символикой\nдля сотрудников компании, работающих на выездных мероприятиях\nи производственных площадках.",
        result: "Практичную форму, защищающую\nот непогоды и усиливающую узнаваемость бренда в поле.",
        images: [
          { src: "/catalog/cases/img_agromig_square.png", alt: "Агромиг — кейс, фото 1" },
          { src: "/catalog/cases/img_agromig_tall.png", alt: "Агромиг — кейс, фото 2" },
        ],
      },
    ],
  },
  headwear: {
    heroTitle: "Головные уборы\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_hats_catalog_cover.png",
      alt: "Головные уборы для брендирования",
    },
    products: [
      {
        title: "Кепки/бейсболки",
        description: "Материал: хлопок\nСостав: 100 % хлопок\nПлотность: 260 гр/метр²\n\nОт 470 ₽",
        imageUrl: "/catalog/hats-catalog/products/img_kepki.png",
      },
      {
        title: "Панамы",
        description: "Состав: 100 % хлопок\nПлотность: 260 гр/метр²\n\nОт 770 ₽",
        imageUrl: "/catalog/hats-catalog/products/img_panami.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    casesVariant: "stacked",
    cases: [
      {
        id: "ldgr-estfest-hats",
        company: "LDGR × ЕстьФест",
        description:
          "Разработали и произвели кепки для команды партнёра гастрономического фестиваля. В дизайне интегрировали фирменные цвета и логотип, обеспечив высокую видимость бренда на площадке.",
        result: "Дополнительный рекламный носитель и единый стиль команды на мероприятии.",
        images: [{ src: "/catalog/cases/img_ldgr_landscape.png", alt: "LDGR × ЕстьФест — кейс" }],
      },
      {
        id: "kolchuga-hats",
        company: "Кольчуга",
        description: "Создали серию бейсболок с аккуратной вышивкой логотипа для корпоративного использования и подарков сотрудникам.",
        result: "Универсальный мерч, сочетающий практичность и ненавязчивую брендовую коммуникацию.",
        images: [{ src: "/catalog/cases/img_kolchuga_landscape.png", alt: "Кольчуга — кейс" }],
      },
      {
        id: "padel-tennis-hats",
        company: "Падел-теннис",
        description: "Изготовили небольшую партию кепок для клуба падел-тенниса с акцентом на спортивный стиль и комфорт во время игры.",
        result: "Клубный аксессуар, усиливающий ощущение принадлежности к команде.",
        images: [{ src: "/catalog/cases/img_padel_tennis_landscape.png", alt: "Падел-теннис — кейс" }],
      },
      {
        id: "academy-uspeh-hats",
        company: "Академия успеха",
        description: "Произвели крупную партию брендированных кепок для участников и наставников образовательной программы.",
        result: "Визуальное единство участников и дополнительный инструмент продвижения проекта.",
        images: [{ src: "/catalog/cases/img_academy_uspeh_landscape.png", alt: "Академия успеха — кейс" }],
      },
    ],
  },
  bags: {
    heroTitle: "сумки и рюкзаки\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_sumki_catalog_cover.png",
      alt: "Сумки и рюкзаки для брендирования",
    },
    products: [
      { title: "Рюкзаки", description: "От 1370 ₽", imageUrl: "/catalog/sumki-catalog/products/img_ryukzaki.png" },
      { title: "Сумки для обуви", description: "От 270 ₽", imageUrl: "/catalog/sumki-catalog/products/img_sumki_dlya_obuvi.png" },
      { title: "Поясные сумки", description: "От 570 ₽", imageUrl: "/catalog/sumki-catalog/products/img_poyasnye_sumki.png" },
      { title: "Шопперы", description: "От 130 ₽", imageUrl: "/catalog/sumki-catalog/products/img_shoppery.png" },
      { title: "Термосумки", description: "От 280 ₽", imageUrl: "/catalog/sumki-catalog/products/img_termosumki.png" },
    ],
    casesVariant: "stacked",
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "damate-bags-1",
        company: "Дамате",
        description:
          "Реализовали масштабное производство рюкзаков для сотрудников и корпоративных программ. Продумали эргономику, материалы и брендинг.",
        result: "Функциональный и долговечный мерч, повышающий лояльность сотрудников\nи узнаваемость бренда.",
        images: [{ src: "/catalog/cases/img_damate_landscape.png", alt: "Дамате — кейс 1" }],
      },
      {
        id: "agromig-bags",
        company: "Агромиг",
        description:
          "Создали партию шопперов для промо-мероприятий и деловых встреч. Минималистичный дизайн подчеркнул экологичность и современность бренда.",
        result: "Удобный промо-носитель, работающий как мобильная реклама компании.",
        images: [{ src: "/catalog/cases/img_agromig_landscape.png", alt: "Агромиг — кейс" }],
      },
      {
        id: "damate-bags-2",
        company: "Дамате",
        description: "Разработали шопперы для корпоративных активностей и внутренних\nмероприятий компании.",
        result: "Практичный мерч для сотрудников и партнёров с повседневным использованием.",
        images: [{ src: "/catalog/cases/img_damate_landscape_2.png", alt: "Дамате — кейс 2" }],
      },
      {
        id: "academy-uspeh-bags-2",
        company: "Академия успеха",
        description: "Изготовили серию шопперов для участников образовательных\nпрограмм и форумов.",
        result: "Полезный сувенир, усиливающий визуальное присутствие бренда в офлайн-среде.",
        images: [{ src: "/catalog/cases/img_academy_uspeh_landscape_2.png", alt: "Академия успеха — кейс 2" }],
      },
      {
        id: "academy-uspeh-bags-1",
        company: "Академия успеха",
        description: "Создали поясные сумки для участников мероприятий, учитывая мобильность\nи удобство во время активностей.",
        result: "Функциональный аксессуар и единый стиль участников на событиях.",
        images: [{ src: "/catalog/cases/img_academy_uspeh_landscape_3.png", alt: "Академия успеха — кейс 1" }],
      },
      {
        id: "damate-bags-3",
        company: "Дамате",
        description: "Произвели крупную партию брендированных сумок для обуви в рамках корпоративных программ и детских активностей.",
        result: "Удобный и востребованный продукт, усиливающий ежедневный контакт\nаудитории с брендом.",
        images: [{ src: "/catalog/cases/img_damate_landscape_3.png", alt: "Дамате — кейс 3" }],
      },

      {
        id: "ufaoil-bags",
        company: "Уфаойл",
        description: "Разработали компактные сумки для обуви с фирменной символикой для внутренних нужд компании и мероприятий.",
        result: "Практичный мерч для сотрудников с аккуратной брендированной подачей.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape_8.png", alt: "Уфаойл — кейс" }],
      },
    ],
  },
  souvenirs: {
    heroTitle: "cувенирнаЯ продукция\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_souvenir_catalog_cover.png",
      alt: "Сувенирная продукция для брендирования",
    },
    products: [
      { title: "Кружки", description: "От 370 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_kruzhki.png" },
      { title: "Бутылки для воды", description: "От 490 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_butylki_dlya_vody.png" },
      { title: "термокружки", description: "От 770 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_termokruzhki.png" },
      { title: "Термосы", description: "От 870 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_termosy.png" },
      { title: "Ручки", description: "От 70 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_ruchki.png" },
      { title: "Ежедневники", description: "От 770 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_ezhednevniki.png" },
      { title: "браслеты", description: "От 25 ₽", imageUrl: "/catalog/souvenir-catalog/products/img_braslety.png" },
    ],
    casesVariant: "stacked",
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "beloreckiy-armaturniy-zavod",
        company: "Белорецкий арматурный завод",
        description: "Создали серию кружек с фирменной символикой для корпоративных подарков и внутреннего использования.",
        result: "Классический сувенир с регулярным контактом с брендом в повседневной жизни.",
        images: [{ src: "/catalog/cases/img_bel_arm_zavod_landscape.png", alt: "Белорецкий арматурный завод — кейс" }],
      },
      {
        id: "tihiy-dom-souvenirs",
        company: "Тихий дом",
        description: "Разработали дизайн и произвели кружки, отражающие ценности и атмосферу бренда.",
        result: "Тёплый и душевный сувенир для клиентов и партнёров.",
        images: [{ src: "/catalog/cases/img_tihiy_dom_landscape.png", alt: "Тихий дом — кейс" }],
      },
      {
        id: "fond-habirova",
        company: "Фонд развития главы РБ Радия Хабирова",
        description: "Изготовили ограниченную партию кружек для официальных мероприятий\nи представительских подарков.",
        result: "Аккуратный имиджевый сувенир для деловых коммуникаций.",
        images: [{ src: "/catalog/cases/img_habirov_landscape.png", alt: "Фонд развития главы РБ Радия Хабирова — кейс" }],
      },
      {
        id: "damate-souvenirs-termosy",
        company: "Дамате",
        description: "Произвели термосы для сотрудников и участников корпоративных мероприятий с акцентом на функциональность и качество.",
        result: "Практичный подарок, повышающий лояльность и ежедневное\nвзаимодействие с брендом.",
        images: [{ src: "/catalog/cases/img_damate_landscape_4.png", alt: "Дамате — кейс 4" }],
      },
      {
        id: "art-kvadrat-souvenirs",
        company: "Арт-квадрат",
        description: "Разработали термосы как часть мерча городского пространства, отражающего креативную атмосферу площадки.",
        result: "Функциональный мерч, дополняющий стиль и идентичность пространства.",
        images: [{ src: "/catalog/cases/img_art_kvadrat_landscape.png", alt: "Арт-квадрат — кейс" }],
      },
      {
        id: "ufanet-souvenirs",
        company: "Уфанет",
        description: "Изготовили ограниченную партию термосов для корпоративных активностей\nи подарков.",
        result: "Компактный имиджевый сувенир с аккуратным брендингом.",
        images: [{ src: "/catalog/cases/img_ufanet_landscape_2.png", alt: "Уфанет — кейс" }],
      },
      {
        id: "mama-varit-kofe",
        company: "МАМА ВАРИТ КОФЕ",
        description:
          "Произвели термосы для корпоративных мероприятий и партнерских подарков. Поставили брендированные термобутылки для реализации под собственной маркой клиента.",
        result: "Практичный сувенир, поддерживающий деловые отношения и узнаваемость бренда.",
        images: [{ src: "/catalog/cases/img_mama_varit_kofe_landscape.png", alt: "МАМА ВАРИТ КОФЕ — кейс" }],
      },
      {
        id: "ufaoil-souvenirs-ruchki",
        company: "Уфаойл",
        description: "Создали партию ручек для деловых встреч, конференций и внутреннего использования.",
        result: "Базовый, но эффективный инструмент брендинга в ежедневной работе.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape.png", alt: "Уфаойл — кейс 1" }],
      },
      {
        id: "damate-souvenirs-ruchki",
        company: "Дамате",
        description: "Изготовили крупную партию ручек для мероприятий, офисов и презентационных наборов.",
        result: "Доступный и массовый брендированный носитель с постоянным контактом.",
        images: [{ src: "/catalog/cases/img_damate_landscape_5.png", alt: "Дамате — кейс 5" }],
      },
      {
        id: "ufaoil-souvenirs-ezhednevniki",
        company: "Уфаойл",
        description: "Разработали дизайн и произвели ежедневники для руководителей\nи сотрудников компании.",
        result: "Деловой аксессуар, подчеркивающий статус бренда и удобный в работе.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape_3.png", alt: "Уфаойл — кейс 2" }],
      },
      {
        id: "damate-souvenirs-ezhednevniki",
        company: "Дамате",
        description: "Создали ежедневники для корпоративного использования\nи подарков партнёрам.",
        result: "Полезный деловой сувенир, усиливающий деловой имидж компании.",
        images: [{ src: "/catalog/cases/img_damate_landscape_6.png", alt: "Дамате — кейс 6" }],
      },
      {
        id: "mister-uunit",
        company: "Мистер УУНиТ",
        description: "Разработали наградные изделия для университетского конкурса с индивидуальным дизайном под событие.",
        result: "Запоминающиеся награды, повышающие значимость мероприятия для участников.",
        images: [{ src: "/catalog/cases/img_uunit_landscape.png", alt: "Мистер УУНиТ — кейс" }],
      },
      {
        id: "dvizhenie-pervih",
        company: "Движение первых",
        description: "Произвели масштабную партию значков для федерального движения с точной передачей фирменной символики.",
        result: "Массовый брендированный атрибут, формирующий чувство причастности у участников.",
        images: [{ src: "/catalog/cases/img_dvizheniye_pervih_landscape.png", alt: "Движение первых — кейс" }],
      },
      {
        id: "academy-uspeh-souvenirs-braslety",
        company: "Академия успеха",
        description: "Создали силиконовые браслеты для участников образовательных программ и форумов.",
        result: "Доступный сувенир с высоким уровнем вовлечения и запоминаемости бренда.",
        images: [{ src: "/catalog/cases/img_academy_uspeh_landscape_4.png", alt: "Академия успеха — кейс 4" }],
      },
    ],
  },
  "custom-souvenirs": {
    heroTitle: "Авторская cувенирнаЯ продукция\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_author_souvenir_catalog_cover.png",
      alt: "Авторская сувенирная продукция для брендирования",
    },
    products: [
      { title: "Акриловый куб", description: "От 1990 ₽", imageUrl: "/catalog/author-souvenir-catalog/products/img_acrylic_cube.png" },
      { title: "мёд", description: "От 390 ₽", imageUrl: "/catalog/author-souvenir-catalog/products/img_honey.png" },
      { title: "игра для детей\nна память", description: "От 370 ₽", imageUrl: "/catalog/author-souvenir-catalog/products/img_damate.png" },
    ],
    casesVariant: "stacked",
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "ufaoil-kapsula-vremeni",
        company: "Уфаоил – «Капсула времени»",
        description: "Разработали концепцию и продукцию с собственной торговой маркой меда\nдля памятного проекта.",
        result: "Уникальный продукт, который усиливает эмоциональную ценность бренда.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape_4.png", alt: "Уфаоил – «Капсула времени» — кейс" }],
      },
      {
        id: "ufaoil-custom-souvenirs",
        company: "Уфаойл",
        description: "Произвели премиальные пледы\nдля подарков ключевым партнерам.",
        result: "Статусные бизнес-подарки, повышающие лояльность и ценность партнерских отношений.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape_5.png", alt: "Уфаойл — кейс" }],
      },
      {
        id: "vremya-pervih",
        company: "Время первых",
        description: "Создали авторскую продукцию для самых талантливых детей России: брендированные наградные изделия 75 кубов и ПВХ-сертификаты.",
        result: "Статусные и запоминающиеся награды, повышающие ценность мероприятия.",
        images: [{ src: "/catalog/cases/img_vremya_pervih_landscape.png", alt: "Время первых — кейс" }],
      },
      {
        id: "damate-2025",
        company: "Дамате 2025",
        description: "Разработали и произвели фирменные подарочные наборы\nдля детей сотрудников компании.",
        result: "Повышение лояльности сотрудников и укрепление HR-бренда через заботу о семьях.",
        images: [{ src: "/catalog/cases/img_damate_landscape_3.png", alt: "Дамате 2025 — кейс" }],
      },
      {
        id: "damate-2026",
        company: "Дамате 2026",
        description: "Продолжение успешного проекта: разработали новую линейку фирменных подарков для детей сотрудников.",
        result: "Системный HR-инструмент для повышения вовлеченности и удержания команды.",
        images: [{ src: "/catalog/cases/img_damate_landscape.png", alt: "Дамате 2026 — кейс" }],
      },
    ],
  },
  "business-accessories": {
    heroTitle: "ДЕЛОВЫЕ АКСЕССУАРЫ\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_business_accessories_catalog_cover.png",
      alt: "Деловые аксессуары для брендирования",
    },
    products: [
      { title: "Картхолдеры", description: "От 570 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_kartholdery.png" },
      { title: "бейджи и ланъярды", description: "От 530 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_beydzhi_i_lanyardy.png" },
      { title: "чехлы для пропуска", description: "От 270 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_chehly_dlya_propuska.png" },
      { title: "ретракторы", description: "От 130 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_retraktory.png" },
      { title: "ролл ап", description: "От 1470 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_roll_ap.png" },
      { title: "календарь", description: "От 570 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_kalendar.png" },
      { title: "подарочные наборы", description: "Индивидуально", imageUrl: "/catalog/bus-accessories-catalog/products/img_podarochnye_nabory.png" },
      { title: "паурбанк", description: "От 1470 ₽", imageUrl: "/catalog/bus-accessories-catalog/products/img_paurbank.png" },
    ],
    casesVariant: "stacked",
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "damate-business-accessories",
        company: "Дамате",
        description: "Разработали картхолдеры в фирменном стиле для пропусков\nи банковских карт сотрудников.",
        result: "Удобный деловой аксессуар и аккуратное присутствие бренда в повседневной жизни.",
        images: [{ src: "/catalog/cases/img_damate_landscape_7.png", alt: "Дамате — кейс" }],
      },
      {
        id: "ufaoil-business-accessories-1",
        company: "Уфаойл",
        description: "Произвели комплект бейджей и ланьярдов для сотрудников\nи деловых мероприятий компании.",
        result: "Единый корпоративный стандарт идентификации персонала.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape.png", alt: "Уфаойл — кейс 1" }],
      },
      {
        id: "liteinvest-business-accessories",
        company: "Лайтинвест",
        description: "Создали серию бейджей и ланьярдов с фирменной символикой для офисного\nи событийного использования.",
        result: "Упорядоченную систему идентификации сотрудников и гостей мероприятий.",
        images: [{ src: "/catalog/cases/img_liteinvest_landscape.png", alt: "Лайтинвест — кейс" }],
      },
      {
        id: "rosprofavia-business-accessories",
        company: "Роспрофавиа",
        description: "Разработали и произвели фирменные ручки для деловых коммуникаций, мероприятий\nи повседневного использования.",
        result: "Функциональный брендированный продукт, который работает на узнаваемость компании и уместен в любой деловой ситуации.",
        images: [{ src: "/catalog/cases/img_rosprofabia_landscape.png", alt: "Роспрофавиа — кейс" }],
      },
      {
        id: "ufaoil-business-accessories-2",
        company: "Уфаойл",
        description: "Изготовили партию пауэрбанков для корпоративных подарков и деловых встреч.",
        result: "Современный технологичный сувенир с высокой практической ценностью.",
        images: [{ src: "/catalog/cases/img_ufaoil_landscape_7.png", alt: "Уфаойл — кейс 2" }],
      },
      {
        id: "kolchuga-business-accessories",
        company: "Кольчуга",
        description: "Создали серию пауэрбанков в фирменной стилистике для сотрудников и партнёров компании.",
        result: "Полезный гаджет, усиливающий технологичный и современный образ бренда.",
        images: [{ src: "/catalog/cases/img_kolchuga_landscape_2.png", alt: "Кольчуга — кейс" }],
      },
    ],
  },
  sportswear: {
    heroTitle: "спортивная одежда\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_sportwear_catalog_cover.png",
      alt: "Спортивная одежда для брендирования",
    },
    products: [
      {
        title: "спортивные футболки",
        description: "Материал: полиэстер\nСостав: 100 % полиэстер\nПлотность: 200 гр/метр²\n\nОт 970 ₽",
        imageUrl: "/catalog/sportwear-catalog/products/img_sport_t_shirt.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    cases: [],
  },
  trousers: {
    heroTitle: "Брюки\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_pants_catalog_cover.png",
      alt: "Брюки для брендирования",
    },
    products: [
      {
        title: "брюки свободного кроя",
        description: "Материал: футер 3-х нитка\nСостав: 80 % хлопок, 20 % полиэстер\nПлотность: 350 гр/метр²\n\nОт 1470 ₽",
        imageUrl: "/catalog/pants-catalog/products/img_bryki_svobod_kroy.png",
      },
      {
        title: "брюки\nкарго",
        description: "Материал: вискоза\nСостав: 50 % хлопок, 45 % вискоза, 5 % эластан\nПлотность: 200 гр/метр²\n\nОт 1570 ₽",
        imageUrl: "/catalog/pants-catalog/products/img_bryki_kargo.png",
      },
      {
        title: "брюки\nтрикотажные",
        description: "Материал: футер 2-х нитка\nСостав: 80 % хлопок, 20 % полиэстер\nПлотность: 250 гр/метр²\n\nОт 1370 ₽",
        imageUrl: "/catalog/pants-catalog/products/img_bryki_trikotazh.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "odzhahuri",
        company: "Оджахури",
        description:
          "Создали партию брюк карго для сотрудников ресторана с учетом требований к комфорту и износостойкости. Дизайн адаптирован под стиль заведения и формат активной работы в зале.",
        result: "Удобную и стильную форму, поддерживающую единый образ команды.",
        images: [{ src: "/catalog/cases/img_odzharuhi_square.png", alt: "Оджахури — кейс" }],
      },
    ],
  },
  bryuki: {
    heroTitle: "Брюки\nдля брендирования",
    heroImage: {
      src: "/catalog/covers/img_pants_catalog_cover.png",
      alt: "Брюки для брендирования",
    },
    products: [
      {
        title: "брюки свободного кроя",
        description: "Материал: футер 3-х нитка\nСостав: 80 % хлопок, 20 % полиэстер\nПлотность: 350 гр/метр²\n\nОт 1470 ₽",
        imageUrl: "/catalog/pants-catalog/products/img_bryki_svobod_kroy.png",
      },
      {
        title: "брюки\nкарго",
        description: "Материал: вискоза\nСостав: 50 % хлопок, 45 % вискоза, 5 % эластан\nПлотность: 200 гр/метр²\n\nОт 1570 ₽",
        imageUrl: "/catalog/pants-catalog/products/img_bryki_kargo.png",
      },
      {
        title: "брюки\nтрикотажные",
        description: "Материал: футер 2-х нитка\nСостав: 80 % хлопок, 20 % полиэстер\nПлотность: 250 гр/метр²\n\nОт 1370 ₽",
        imageUrl: "/catalog/pants-catalog/products/img_bryki_trikotazh.png",
      },
    ],
    casesTitle: "Примеры\nреализованных работ",
    cases: [
      {
        id: "odzhahuri",
        company: "Оджахури",
        description:
          "Создали партию брюк карго для сотрудников ресторана с учетом требований к комфорту и износостойкости. Дизайн адаптирован под стиль заведения и формат активной работы в зале.",
        result: "Удобную и стильную форму, поддерживающую единый образ команды.",
        images: [{ src: "/catalog/cases/img_odzharuhi_square.png", alt: "Оджахури — кейс" }],
      },
    ],
  },
};

export function getCatalogData(category?: string): CatalogPageData {
  if (!category) {
    return MAIN_CATALOG_DATA;
  }

  return CATEGORY_CATALOG_DATA[category] ?? MAIN_CATALOG_DATA;
}
