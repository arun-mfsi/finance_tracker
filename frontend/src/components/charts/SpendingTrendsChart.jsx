import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SpendingTrendsChart = ({ data, isLoading, title = "Spending Trends" }) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.period);
      return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Income',
        data: data.map(item => item.income || 0),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Expenses',
        data: data.map(item => item.expenses || 0),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Net',
        data: data.map(item => (item.income || 0) - (item.expenses || 0)),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  return (
    <Paper sx={{
      p: 3,
      height: 420,
      borderRadius: 2,
      backgroundColor: 'white',
      border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    }}>
      <Typography variant="h6" gutterBottom fontWeight="600" sx={{
        color: '#1a1a1a',
        mb: 3,
        textAlign: { xs: 'center', md: 'left' }
      }}>
        {title}
      </Typography>
      <Box sx={{ height: 340 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default SpendingTrendsChart;
