import Chart from "react-google-charts";
import "./DashBoard.css";
import { BiCommentDots } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import { useEffect, useState } from "react";
import commentApi from "../../api/Comment.Api";
import paymentApi from "../../api/Payment.Api";
import userApi from "../../api/User.Api";

const DashBoard = () => {
  const [comments, setComments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [users, setUsers] = useState([]);
  const [columnChartData, setColumnChartData] = useState([
    ["Month", "Sales"],
    ["January", 0],
    ["February", 0],
    ["March", 0],
    ["April", 0],
    ["May", 0],
    ["June", 0],
    ["July", 0],
    ["August", 0],
    ["September", 0],
    ["October", 0],
    ["November", 0],
    ["December", 0],
  ]);

  // Lấy danh sách thanh toán và tính tổng doanh thu trong tháng
  async function fetchPayments() {
    try {
      const response = await paymentApi.getPayment();
      if (response.status === 200) {
        const paymentsData = response.data;

        const monthlyRevenue = Array.from({ length: 12 }, () => 0); // Tạo mảng 12 tháng với giá trị ban đầu là 0
        paymentsData.forEach((payment:any) => {
          const paymentDate = new Date(payment.createdAt);
          const paymentMonth = paymentDate.getMonth();
          monthlyRevenue[paymentMonth] += payment.total;
        });

        // Cập nhật dữ liệu doanh thu cho từng tháng
        const updatedChartData = [...columnChartData];
        for (let i = 0; i < 12; i++) {
          updatedChartData[i + 1][1] = monthlyRevenue[i];
        }

        setColumnChartData(updatedChartData);

        const newTotal = monthlyRevenue.reduce((total, current) => total + current, 0);
        setTotalRevenue(newTotal);
      }
    } catch (error) {
      console.log("Lỗi khi gửi yêu cầu:", error);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  // Get Comment
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await commentApi.getAllComments();
        if (response.status === 200) {
          setComments(response.data);
        } else {
          console.error("Lỗi khi lấy danh sách bình luận.");
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
      }
    }

    fetchComments();
  }, [comments]);

  
  // Get All Users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await userApi.getAllUser();
        setUsers(response.data);
      } catch (error) {
        console.log("Lỗi khi gửi yêu cầu:", error);
      }
    }
    fetchUsers();
  }, [users]);

  return (
    <div className="wrapper-dashboard">
      <div className="content-chart">
        <h2>Manager Dashboard</h2>
        <div className="dashboard-box">
          <div className="dashboard-comment">
            <h4>Comment Section</h4>
            <BiCommentDots className="icons-dashboard" />
            <div className="text-content-dashboard">
              <span>{comments.length} comments</span>
              <p>All Comment</p>
            </div>
          </div>
          <div className="dashboard-total-payment">
            <h4>Total Payment Section</h4>
            <FaMoneyBill className="icons-payment" />
            <div className="text-content-payment">
              <span>{totalRevenue} $</span>
              <p>ToTal</p>
            </div>
          </div>
          <div className="dashboard-user-register">
            <h4>User Register Section</h4>
            <BiUserPlus className="icons-users" />
            <div className="text-content-users">
              <span>{users.length} Users</span>
              <p>All User Register</p>
            </div>
          </div>
        </div>

        <div className="content-chart-left">
          <Chart
            className="user-dashboard-content"
            chartType="ColumnChart"
            width="100%"
            height="500px"
            data={columnChartData}
          />
        </div>
        <div className="content-chart-right">
          <Chart
            className="user-dashboard-content"
            chartType="LineChart"
            width="100%"
            height="300px"
            data={columnChartData}
          />
          <Chart
            className="user-dashboard-content"
            chartType="PieChart"
            width="100%"
            height="300px"
            data={columnChartData}
          />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
