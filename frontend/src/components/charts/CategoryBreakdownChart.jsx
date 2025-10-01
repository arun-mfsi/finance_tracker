import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { getCategoryName } from '../../constants/categories';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryBreakdownChart = ({ data, isLoading, title = "Category Breakdown" }) => {
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
    labels: data.map(item => getCategoryName(item.category) || item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF6384',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF6384',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
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
        <Doughnut data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default CategoryBreakdownChart;
