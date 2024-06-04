import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SalesGraph = ({ chartData }) => {
  // Function to convert full day names to abbreviations
  const dayAbbreviator = (fullDayName) => {
    switch (fullDayName) {
      case "Sunday":
        return "Sun";
      case "Monday":
        return "Mon";
      case "Tuesday":
        return "Tue";
      case "Wednesday":
        return "Wed";
      case "Thursday":
        return "Thu";
      case "Friday":
        return "Fri";
      case "Saturday":
        return "Sat";
      default:
        return "";
    }
  };

  return (
    <div className="border rounded-xl p-4">
      <LineChart width={340} height={230} data={chartData}>
        <XAxis dataKey="day" tickFormatter={dayAbbreviator} />
        <YAxis type="number" domain={[0, "dataMax + 100"]} width={40} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

SalesGraph.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      sales: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
export default SalesGraph;
