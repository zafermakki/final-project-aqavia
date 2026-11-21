
import "./StatCard.css";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
}) {
  return (
    <article className={`stat-card stat-${color}`}>

      <div className="stat-card-info">
        <p className="stat-card-title">{title}</p>

        <h3>{value}</h3>

        <span>{subtitle}</span>
      </div>

      <div className="stat-card-icon">
        <Icon size={25} strokeWidth={1.8} />
      </div>

    </article>
  );
}

export default StatCard;
