import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, RadarChart, Radar, ScatterChart, Scatter, ComposedChart, RadialBarChart, RadialBar, FunnelChart, Funnel, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Users, Target, Award, TrendingUp, Calendar, BookOpen } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // State for all data
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [performanceVsTasks, setPerformanceVsTasks] = useState([]);
  const [projectProgress, setProjectProgress] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [performanceRanges, setPerformanceRanges] = useState([]);
  const [satisfactionTrend, setSatisfactionTrend] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  
  // New features state
  const [goals, setGoals] = useState([]);
  const [goalsOverview, setGoalsOverview] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [training, setTraining] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [collaboration, setCollaboration] = useState([]);
  const [departmentCollaboration, setDepartmentCollaboration] = useState([]);
  const [performancePrediction, setPerformancePrediction] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  const [growthPotential, setGrowthPotential] = useState([]);
  
  // Employee comparison state
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [
        employeesRes, statsRes, monthlyRes, skillsRes, deptRes,
        perfTasksRes, funnelRes, attendanceRes, rangesRes,
        satisfactionRes, responseRes,
        goalsRes, goalsOverviewRes, certificationsRes, trainingRes,
        trainingProgressRes, collaborationRes, deptCollabRes,
        predictionRes, riskRes, growthRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/employees`),
        fetch(`${API_BASE_URL}/stats`),
        fetch(`${API_BASE_URL}/performance/monthly`),
        fetch(`${API_BASE_URL}/skills`),
        fetch(`${API_BASE_URL}/departments/distribution`),
        fetch(`${API_BASE_URL}/analytics/performance-tasks`),
        fetch(`${API_BASE_URL}/analytics/project-funnel`),
        fetch(`${API_BASE_URL}/attendance`),
        fetch(`${API_BASE_URL}/analytics/performance-ranges`),
        fetch(`${API_BASE_URL}/analytics/satisfaction-trend`),
        fetch(`${API_BASE_URL}/analytics/response-time`),
        fetch(`${API_BASE_URL}/goals`),
        fetch(`${API_BASE_URL}/analytics/goals-overview`),
        fetch(`${API_BASE_URL}/certifications`),
        fetch(`${API_BASE_URL}/training`),
        fetch(`${API_BASE_URL}/analytics/training-progress`),
        fetch(`${API_BASE_URL}/collaboration`),
        fetch(`${API_BASE_URL}/analytics/department-collaboration`),
        fetch(`${API_BASE_URL}/analytics/performance-prediction`),
        fetch(`${API_BASE_URL}/analytics/employee-risk-analysis`),
        fetch(`${API_BASE_URL}/analytics/growth-potential`)
      ]);

      setEmployees(await employeesRes.json());
      setStats(await statsRes.json());
      setMonthlyPerformance(await monthlyRes.json());
      setSkillsData(await skillsRes.json());
      setDepartmentDistribution(await deptRes.json());
      setPerformanceVsTasks(await perfTasksRes.json());
      setProjectProgress(await funnelRes.json());
      setWeeklyActivity(await attendanceRes.json());
      setPerformanceRanges(await rangesRes.json());
      setSatisfactionTrend(await satisfactionRes.json());
      setResponseTimeData(await responseRes.json());
      setGoals(await goalsRes.json());
      setGoalsOverview(await goalsOverviewRes.json());
      setCertifications(await certificationsRes.json());
      setTraining(await trainingRes.json());
      setTrainingProgress(await trainingProgressRes.json());
      setCollaboration(await collaborationRes.json());
      setDepartmentCollaboration(await deptCollabRes.json());
      setPerformancePrediction(await predictionRes.json());
      setRiskAnalysis(await riskRes.json());
      setGrowthPotential(await growthRes.json());

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEmployeeSelection = (empId) => {
    if (selectedForComparison.includes(empId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== empId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, empId]);
    }
  };

  const compareEmployees = async () => {
    if (selectedForComparison.length < 2) {
      alert('Please select at least 2 employees to compare');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/analytics/compare-employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIds: selectedForComparison })
      });
      const data = await response.json();
      setComparisonData(data);
      setActiveTab('comparison');
    } catch (error) {
      console.error('Error comparing employees:', error);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 Employee Performance Dashboard</h1>
          <p className="text-blue-200">Real-time analytics with advanced features</p>
          
          <div className="flex gap-4 mt-4 flex-wrap">
            <select 
              className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="all">All Employees</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            
            <select 
              className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
            </select>

            {selectedForComparison.length > 0 && (
              <button
                onClick={compareEmployees}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Compare ({selectedForComparison.length}) Employees
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 mb-6 border border-white/20 flex gap-2 flex-wrap">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: <Users size={18} /> },
            { id: 'goals', label: '🎯 Goals', icon: <Target size={18} /> },
            { id: 'training', label: '📚 Training', icon: <BookOpen size={18} /> },
            { id: 'collaboration', label: '🤝 Collaboration', icon: <Users size={18} /> },
            { id: 'predictions', label: '🔮 Predictions', icon: <TrendingUp size={18} /> },
            { id: 'comparison', label: '⚖️ Comparison', icon: <Users size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Employees', value: stats.totalEmployees, icon: '👥' },
            { label: 'Avg Performance', value: `${stats.avgPerformance}%`, icon: '📊' },
            { label: 'Tasks Completed', value: stats.totalTasks?.toLocaleString(), icon: '✅' },
            { label: 'Satisfaction', value: `${stats.avgSatisfaction}/5`, icon: '⭐' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Original 10 charts */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">1. Performance by Employee (Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={employees}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="performance_score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {employees.slice(0, 3).map(emp => (
                  <label key={emp.id} className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedForComparison.includes(emp.id)}
                      onChange={() => handleEmployeeSelection(emp.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Select {emp.name} for comparison</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">2. Monthly Performance Trends (Line Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="month" tick={{ fill: '#fff' }} />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="marketing" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="engineering" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">3. Department Distribution (Pie Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie 
                    data={departmentDistribution} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={({ name, value }) => `${name}: ${value}`} 
                    outerRadius={80} 
                    dataKey="value"
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">4. Skills Assessment (Radar Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#ffffff50" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#fff', fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: '#fff' }} />
                  <Radar name="Skills" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">5. Weekly Activity (Area Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="day" tick={{ fill: '#fff' }} />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="hours" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="productivity" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">6. Performance vs Tasks (Scatter Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis type="number" dataKey="tasks" name="Tasks" tick={{ fill: '#fff' }} />
                  <YAxis type="number" dataKey="performance" name="Performance" tick={{ fill: '#fff' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Scatter name="Employees" data={performanceVsTasks} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">7. Multi-Metric Analysis (Composed Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="day" tick={{ fill: '#fff' }} />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">8. Performance Ranges (Radial Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceRanges} startAngle={180} endAngle={0}>
                  <RadialBar minAngle={15} background clockWise dataKey="count" />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ color: '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">9. Project Pipeline (Funnel Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <FunnelChart>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Funnel dataKey="employees" data={projectProgress} isAnimationActive>
                    {projectProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">10. Avg Response Time (Horizontal Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={responseTimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis type="number" tick={{ fill: '#fff' }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#fff' }} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="time" radius={[0, 8, 8, 0]}>
                    {responseTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* NEW: Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Goals Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={goalsOverview} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      label={({ name, value }) => `${name}: ${value}`} 
                      outerRadius={100} 
                      dataKey="value"
                    >
                      {goalsOverview.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">📈 Goal Progress by Employee</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={goals.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="employee_name" tick={{ fill: '#fff', fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="progress_percentage" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">All Goals</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Goal</th>
                      <th className="text-left p-2">Progress</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal) => (
                      <tr key={goal.id} className="border-b border-white/10">
                        <td className="p-2">{goal.employee_name}</td>
                        <td className="p-2">{goal.title}</td>
                        <td className="p-2">
                          <div className="w-full bg-white/20 rounded-full h-4">
                            <div 
                              className="bg-green-500 h-4 rounded-full flex items-center justify-center text-xs"
                              style={{ width: `${goal.progress_percentage}%` }}
                            >
                              {goal.progress_percentage}%
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            goal.status === 'completed' ? 'bg-green-500' :
                            goal.status === 'in_progress' ? 'bg-blue-500' :
                            goal.status === 'overdue' ? 'bg-red-500' : 'bg-gray-500'
                          }`}>
                            {goal.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2">{new Date(goal.due_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">📚 Training Progress by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trainingProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="category" tick={{ fill: '#fff' }} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="avg_completion" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🏆 Active Certifications</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {certifications.filter(c => c.status === 'active').slice(0, 6).map((cert) => (
                    <div key={cert.id} className="bg-white/10 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🏅</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{cert.certification_name}</div>
                          <div className="text-sm text-blue-200">{cert.employee_name} • {cert.issuing_organization}</div>
                          <div className="text-xs text-blue-300">Expires: {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Training Programs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Program</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Duration</th>
                      <th className="text-left p-2">Completion</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {training.map((prog) => (
                      <tr key={prog.id} className="border-b border-white/10">
                        <td className="p-2">{prog.employee_name}</td>
                        <td className="p-2">{prog.program_name}</td>
                        <td className="p-2">{prog.category}</td>
                        <td className="p-2">{prog.duration_hours}h</td>
                        <td className="p-2">
                          <div className="w-full bg-white/20 rounded-full h-4">
                            <div 
                              className="bg-purple-500 h-4 rounded-full flex items-center justify-center text-xs"
                              style={{ width: `${prog.completion_percentage}%` }}
                            >
                              {prog.completion_percentage}%
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            prog.status === 'completed' ? 'bg-green-500' :
                            prog.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}>
                            {prog.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Collaboration Tab */}
        {activeTab === 'collaboration' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🤝 Department Collaboration</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentCollaboration}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="department" tick={{ fill: '#fff' }} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="avg_score" fill="#3b82f6" name="Avg Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">💬 Communication Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={collaboration.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="employee_name" tick={{ fill: '#fff', fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="messages_sent" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="documents_shared" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Collaboration Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Meetings</th>
                      <th className="text-left p-2">Messages</th>
                      <th className="text-left p-2">Documents</th>
                      <th className="text-left p-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collaboration.map((collab) => (
                      <tr key={collab.id} className="border-b border-white/10">
                        <td className="p-2">{collab.employee_name}</td>
                        <td className="p-2">{collab.department}</td>
                        <td className="p-2">{collab.meetings_attended}</td>
                        <td className="p-2">{collab.messages_sent}</td>
                        <td className="p-2">{collab.documents_shared}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            collab.collaboration_score >= 85 ? 'bg-green-500' :
                            collab.collaboration_score >= 70 ? 'bg-blue-500' : 'bg-orange-500'
                          }`}>
                            {collab.collaboration_score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🔮 Performance Prediction</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performancePrediction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="month" tick={{ fill: '#fff' }} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual" />
                    <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="Predicted" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🌟 Growth Potential</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={growthPotential.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="growth_score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">⚠️ Risk Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Performance</th>
                      <th className="text-left p-2">Satisfaction</th>
                      <th className="text-left p-2">Overdue Goals</th>
                      <th className="text-left p-2">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskAnalysis.map((risk) => (
                      <tr key={risk.id} className="border-b border-white/10">
                        <td className="p-2">{risk.name}</td>
                        <td className="p-2">{risk.department}</td>
                        <td className="p-2">{risk.performance_score}%</td>
                        <td className="p-2">{risk.customer_satisfaction}/5</td>
                        <td className="p-2">{risk.overdue_goals}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            risk.risk_level === 'High Risk' ? 'bg-red-500' :
                            risk.risk_level === 'Medium Risk' ? 'bg-orange-500' : 'bg-green-500'
                          }`}>
                            {risk.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">💡 Insights & Recommendations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/20 p-4 rounded-lg">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-white font-semibold">Trend Analysis</div>
                  <div className="text-blue-200 text-sm mt-2">
                    Performance is predicted to increase by 2-3% over the next quarter based on current trends.
                  </div>
                </div>
                <div className="bg-green-500/20 p-4 rounded-lg">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="text-white font-semibold">Top Performers</div>
                  <div className="text-green-200 text-sm mt-2">
                    {growthPotential[0]?.name} shows highest growth potential with training completion rate of 100%.
                  </div>
                </div>
                <div className="bg-orange-500/20 p-4 rounded-lg">
                  <div className="text-3xl mb-2">⚠️</div>
                  <div className="text-white font-semibold">At-Risk Employees</div>
                  <div className="text-orange-200 text-sm mt-2">
                    {riskAnalysis.filter(r => r.risk_level === 'High Risk').length} employees need immediate attention.
                  </div>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-white font-semibold">Goal Achievement</div>
                  <div className="text-purple-200 text-sm mt-2">
                    {Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100)}% of goals completed this quarter.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {comparisonData.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-2xl font-bold text-white mb-2">Employee Comparison Tool</h3>
                <p className="text-blue-200 mb-6">
                  Select 2-3 employees from the Dashboard tab and click "Compare" to see detailed side-by-side analysis.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">📊 Performance Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      {
                        metric: 'Performance',
                        ...comparisonData.reduce((acc, emp) => ({ ...acc, [emp.name]: emp.performance_score }), {})
                      },
                      {
                        metric: 'Tasks',
                        ...comparisonData.reduce((acc, emp) => ({ ...acc, [emp.name]: emp.tasks_completed / 2 }), {})
                      },
                      {
                        metric: 'Satisfaction',
                        ...comparisonData.reduce((acc, emp) => ({ ...acc, [emp.name]: emp.customer_satisfaction * 20 }), {})
                      },
                      {
                        metric: 'Skills',
                        ...comparisonData.reduce((acc, emp) => ({ ...acc, [emp.name]: emp.avg_skill_level }), {})
                      },
                      {
                        metric: 'Response Time',
                        ...comparisonData.reduce((acc, emp) => ({ ...acc, [emp.name]: Math.max(0, 100 - emp.avg_response_time * 20) }), {})
                      }
                    ]}>
                      <PolarGrid stroke="#ffffff50" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#fff' }} />
                      <PolarRadiusAxis tick={{ fill: '#fff' }} />
                      {comparisonData.map((emp, index) => (
                        <Radar
                          key={emp.id}
                          name={emp.name}
                          dataKey={emp.name}
                          stroke={COLORS[index]}
                          fill={COLORS[index]}
                          fillOpacity={0.5}
                        />
                      ))}
                      <Legend />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Detailed Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-2">Metric</th>
                          {comparisonData.map(emp => (
                            <th key={emp.id} className="text-center p-2">{emp.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Department</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">{emp.department}</td>
                          ))}
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Performance Score</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">
                              <span className="px-2 py-1 bg-blue-500 rounded">{emp.performance_score}%</span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Tasks Completed</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">{emp.tasks_completed}</td>
                          ))}
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Avg Response Time</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">{emp.avg_response_time}h</td>
                          ))}
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Customer Satisfaction</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">{emp.customer_satisfaction}/5</td>
                          ))}
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Avg Skill Level</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">{emp.avg_skill_level}%</td>
                          ))}
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-2 font-semibold">Goals Completed</td>
                          {comparisonData.map(emp => (
                            <td key={emp.id} className="text-center p-2">
                              <span className="px-2 py-1 bg-green-500 rounded">{emp.goals_completed}</span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setComparisonData([]);
                    setSelectedForComparison([]);
                    setActiveTab('dashboard');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Clear Comparison
                </button>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <p className="text-blue-200 text-sm">
            📊 Enhanced Dashboard • 5 New Features • Real-time Analytics • MySQL Backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;