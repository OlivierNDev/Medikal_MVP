import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function AdminPanel() {
  const patientTrafficRef = useRef(null);
  const medicationRef = useRef(null);
  const amrRef = useRef(null);
  const patientTrafficChart = useRef(null);
  const medicationChart = useRef(null);
  const amrChart = useRef(null);

  const kpiData = [
    {
      title: "Today's Patients",
      value: 247,
      change: '↑ 12% from yesterday',
      icon: 'fas fa-users',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      changeColor: 'text-green-600'
    },
    {
      title: "Prescriptions",
      value: 1832,
      change: '↑ 8% from yesterday',
      icon: 'fas fa-prescription',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      changeColor: 'text-green-600'
    },
    {
      title: "AMR Alerts",
      value: 23,
      change: '↑ 15% from yesterday',
      icon: 'fas fa-exclamation-triangle',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      changeColor: 'text-red-600'
    },
    {
      title: "Active Doctors",
      value: 42,
      change: '↑ 2% from yesterday',
      icon: 'fas fa-user-md',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      changeColor: 'text-green-600'
    }
  ];

  const systemHealthData = [
    { label: 'API Uptime', value: 99.9, color: 'bg-green-600' },
    { label: 'Database Performance', value: 95, color: 'bg-blue-600' },
    { label: 'AI Model Response', value: 88, color: 'bg-purple-600' },
    { label: 'Storage Usage', value: 67, color: 'bg-yellow-600' }
  ];

  const usersData = [
    { name: 'Dr. Sarah Johnson', role: 'Doctor', status: 'Active', lastLogin: '2 hours ago' },
    { name: 'Alice Mukamana', role: 'Admin', status: 'Active', lastLogin: '30 minutes ago' },
    { name: 'Jean Claude Niyongabo', role: 'Patient', status: 'Inactive', lastLogin: '3 days ago' }
  ];

  useEffect(() => {
    // Patient Traffic Chart
    if (patientTrafficRef.current) {
      patientTrafficChart.current = new Chart(patientTrafficRef.current, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Patients',
            data: [245, 289, 312, 278, 334, 298, 247],
            borderColor: 'rgb(147, 51, 234)',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Medication Chart
    if (medicationRef.current) {
      medicationChart.current = new Chart(medicationRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Omeprazole', 'Others'],
          datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
              'rgb(147, 51, 234)',
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    // AMR Chart
    if (amrRef.current) {
      amrChart.current = new Chart(amrRef.current, {
        type: 'bar',
        data: {
          labels: ['Amoxicillin', 'Ciprofloxacin', 'Azithromycin', 'Ceftriaxone', 'Doxycycline'],
          datasets: [{
            label: 'Risk Score',
            data: [75, 65, 45, 35, 25],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(147, 51, 234, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (patientTrafficChart.current) {
        patientTrafficChart.current.destroy();
      }
      if (medicationChart.current) {
        medicationChart.current.destroy();
      }
      if (amrChart.current) {
        amrChart.current.destroy();
      }
    };
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Doctor':
        return 'bg-blue-100 text-blue-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Patient':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{kpi.value.toLocaleString()}</p>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-full`}>
                <i className={`${kpi.icon} ${kpi.iconColor} text-xl`}></i>
              </div>
            </div>
            <div className="mt-4">
              <span className={`${kpi.changeColor} text-sm`}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Patient Traffic Chart */}
        <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-chart-line text-purple-600 mr-2"></i>Patient Traffic (Last 7 Days)
          </h3>
          <div style={{ height: '300px' }}>
            <canvas ref={patientTrafficRef}></canvas>
          </div>
        </div>

        {/* Medication Trends */}
        <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-pills text-purple-600 mr-2"></i>Top Prescribed Medications
          </h3>
          <div style={{ height: '300px' }}>
            <canvas ref={medicationRef}></canvas>
          </div>
        </div>

        {/* AMR Analytics */}
        <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-shield-alt text-purple-600 mr-2"></i>AMR Risk Analysis
          </h3>
          <div style={{ height: '300px' }}>
            <canvas ref={amrRef}></canvas>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-server text-purple-600 mr-2"></i>System Health
          </h3>
          <div className="space-y-4">
            {systemHealthData.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`${metric.color} h-2 rounded-full`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{metric.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg card-shadow p-4 md:p-6 mt-6 md:mt-8">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-users-cog text-purple-600 mr-2"></i>User Management
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last Login</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{user.lastLogin}</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;