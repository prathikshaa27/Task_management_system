import React ,{useEffect, useState}from "react";
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend } from "recharts";
import {Card,Spinner,Table} from "react-bootstrap";
import { fetchAnalyticsSummary } from "../../services/task";


const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545"];

export default function AdminDashboardAnalytics(){
    const[data,setData] = useState(null)
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async() =>{
            try{
                const analyticsData = await fetchAnalyticsSummary();
                setData(analyticsData)
            }catch(err){
                console.error("Erro fetching analytics", err);
            }finally{
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);
    if(loading){
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }
    const taskDayData = Object.entries(data.tasks_per_day).map(([day, count]) =>({
        day,
        count,
    }));
    return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="text-center text-primary">Admin Task Analytics</h3>
        <p className="text-muted text-center">
          Overview of task statistics and user activity
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Tasks Created Per Day</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={taskDayData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Task Status Distribution</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.status_summary}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {data.status_summary.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3">Top Active Users</Card.Title>
              <Table striped bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>Username</th>
                    <th>Task Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.active_users.map((user, idx) => (
                    <tr key={idx}>
                      <td>{user.user__username}</td>
                      <td>{user.task_count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
