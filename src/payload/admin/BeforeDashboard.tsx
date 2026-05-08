export default function BeforeDashboard() {
  return (
    <div
      style={{
        marginBottom: 24,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 12px",
            marginBottom: 14,
            borderRadius: "9px",
            color: "rgba(2, 82, 197, 1)",
            border: "2px solid rgba(2, 82, 197, .8)",
            background: "rgba(2, 82, 197, 0.14)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          Добро пожаловать в Панель администратора
        </div>

        <p style={{ maxWidth: 760, opacity: 0.84, lineHeight: 1.6 }}>
          Здесь можно редактировать страницы сайта, публикации блога, медиафайлы и общую информацию о компании. Основной рабочий процесс в админке:
          внести изменения, проверить результат и затем опубликовать его.
        </p>
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: "14px 16px",
          borderRadius: 14,
          border: "1px solid rgba(42, 42, 42, 0.12)",
          background: "rgba(232, 231, 226, 0.40)",
        }}
      >
        <strong style={{ display: "block", marginBottom: 6, fontSize: 15 }}>Важно: изменения не публикуются автоматически</strong>
        <p style={{ margin: 0, opacity: 0.88, lineHeight: 1.6 }}>
          По умолчанию новые материалы и правки сохраняются как черновики. Если после проверки не нажать Publish, изменения не появятся на публичном
          сайте.
        </p>
      </div>
    </div>
  );
}
