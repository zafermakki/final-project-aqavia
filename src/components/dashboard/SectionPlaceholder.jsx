import "./SectionPlaceholder.css";

function SectionPlaceholder({ title, description }) {
  return (
    <section className="section-placeholder">
      <div className="section-placeholder-heading">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="section-placeholder-content">
        <p>
          {title} management will be available here.
        </p>
      </div>
    </section>
  );
}

export default SectionPlaceholder;
