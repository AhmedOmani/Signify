import React from "react";

const TranslationResult = ({ prediction, onReset }) => (
  <div className="translation-result-card">
    <h2 className="translation-label">نتيجة الترجمة</h2>
    <div
      className={`translation-result${prediction ? " animate" : ""}`}
      dir="rtl"
      tabIndex={0}
      aria-label="نتيجة الترجمة"
    >
      {prediction || <span className="placeholder">ابدأ بالإشارة لعرض الترجمة...</span>}
    </div>
    <button className="reset-btn" onClick={onReset} aria-label="إعادة تعيين الترجمة">إعادة تعيين</button>
  </div>
);

export default TranslationResult; 