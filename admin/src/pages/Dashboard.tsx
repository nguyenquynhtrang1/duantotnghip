import { useQueries } from "@tanstack/react-query";
import { Card, Col, Row, Select, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  getRevenueByMonth,
  getRevenueByRoomType,
  getTotalBookings,
} from "../apis/booking";
import { BookingStatus } from "../types/booking";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Revenue by Month",
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      position: "left" as const, // Trục y bên trái
      beginAtZero: true,
      title: {
        display: true,
        text: "Revenue (VND)",
      },
    },
    y1: {
      type: "linear" as const,
      position: "right" as const, // Trục y bên phải
      beginAtZero: true,
      grid: {
        drawOnChartArea: false, // Loại bỏ đường kẻ của trục y phải khỏi vùng biểu đồ
      },
      title: {
        display: true,
        text: "Bookings",
      },
    },
  },
};

const generateFullYearData = (
  year: number,
  data: { month: string; totalRevenue: number; bookings: number }[]
) => {
  const monthsInYear = [
    `${year}-01`,
    `${year}-02`,
    `${year}-03`,
    `${year}-04`,
    `${year}-05`,
    `${year}-06`,
    `${year}-07`,
    `${year}-08`,
    `${year}-09`,
    `${year}-10`,
    `${year}-11`,
    `${year}-12`,
  ];

  const fullYearData = monthsInYear.map((month) => {
    const existingData = data.find((item) => item.month === month);
    return existingData
      ? existingData
      : { month, totalRevenue: 0, bookings: 0 };
  });

  return fullYearData;
};

export default function Dashboard() {
  const [year, setYear] = useState(2024);
  const queries = useQueries({
    queries: [
      {
        queryKey: ["TotalBookings"],
        queryFn: getTotalBookings,
      },
      {
        queryKey: ["RevenuebyMonth", year],
        queryFn: () => getRevenueByMonth({ year }),
      },
      {
        queryKey: ["RevenuebyRoomType", year],
        queryFn: () => getRevenueByRoomType({ year }),
      },
    ],
  });
  const { data: totalBooking, isLoading: loadingBookings } = queries[0];
  const { data: revenueByMonth, isLoading: loadingRevenueByMonth } = queries[1];
  const { data: revenueByRoomType, isLoading: loadingRevenueByRoomType } =
    queries[2];

  const BOOKING_STATUS_INFO = {
    [BookingStatus.Pending]: {
      color: "#1d39c4",
      icon: <ClockCircleOutlined />,
    },
    [BookingStatus.Confirmed]: {
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    [BookingStatus.Cancelled]: { color: "#d4380d", icon: <StopOutlined /> },
  };

  return (
    <Row gutter={[16, 16]}>
      {totalBooking?.data.map(({ status, count }) => (
        <Col span={8} key={status}>
          <Card
            title={
              <Typography.Text
                strong
                italic
                style={{
                  color: BOOKING_STATUS_INFO[status].color,
                  fontSize: 16,
                }}
              >{`Bookings ${status}`}</Typography.Text>
            }
            bordered={true}
            loading={loadingBookings}
            style={{
              borderColor: BOOKING_STATUS_INFO[status].color,
              borderWidth: 2,
            }}
          >
            <Typography.Title
              level={2}
              style={{ color: BOOKING_STATUS_INFO[status].color }}
            >
              <span style={{ marginRight: 8 }}>{count}</span>
              {BOOKING_STATUS_INFO[status].icon}
            </Typography.Title>
          </Card>
        </Col>
      ))}
      <Col span={24}>
        <Card
          loading={loadingRevenueByMonth || loadingRevenueByRoomType}
          title={
            <Row align="middle">
              <Typography.Text style={{ fontSize: 16 }}>
                Revenue statistics
              </Typography.Text>
              <Select
                defaultValue={2024}
                onChange={(value) => setYear(value)}
                variant="borderless"
                options={[
                  {
                    label: "2024",
                    value: 2024,
                  },
                  {
                    label: "2023",
                    value: 2023,
                  },
                  {
                    label: "2022",
                    value: 2022,
                  },
                ]}
              />
            </Row>
          }
          bordered={true}
        >
          <Row gutter={16}>
            <Col span={15}>
              <Bar
                data={{
                  labels: generateFullYearData(
                    year,
                    revenueByMonth?.data || []
                  ).map((item) => item.month),
                  datasets: [
                    {
                      label: "Revenue",
                      data: generateFullYearData(
                        year,
                        revenueByMonth?.data || []
                      ).map((item) => item.totalRevenue),
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                      yAxisID: "y",
                    },
                    {
                      label: "Booking",
                      data: generateFullYearData(
                        year,
                        revenueByMonth?.data || []
                      ).map((item) => item.bookings),
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 1,
                      yAxisID: "y1",
                    },
                  ],
                }}
                options={options}
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={2}></Col>
            <Col span={7}>
              <Pie
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Revenue by Room Type",
                    },
                  },
                }}
                data={{
                  labels:
                    revenueByRoomType?.data.map((item) => item.roomType) || [],
                  datasets: [
                    {
                      label: "Revenue",
                      data: revenueByRoomType?.data.map(
                        (item) => item.totalRevenue
                      ),
                      backgroundColor: [
                        "rgba(255, 159, 64, 0.5)",
                        "rgba(199, 199, 199, 0.5)",
                        "rgba(83, 102, 255, 0.5)",
                        "rgba(255, 102, 255, 0.5)",
                        "rgba(102, 255, 102, 0.5)",
                        "rgba(255, 255, 102, 0.5)",
                        "rgba(102, 255, 255, 0.5)",
                        "rgba(255, 102, 102, 0.5)",
                        "rgba(102, 102, 255, 0.5)",
                        "rgba(255, 153, 51, 0.5)",
                      ],
                      borderColor: [
                        "rgba(255, 159, 64, 1)",
                        "rgba(199, 199, 199, 1)",
                        "rgba(83, 102, 255, 1)",
                        "rgba(255, 102, 255, 1)",
                        "rgba(102, 255, 102, 1)",
                        "rgba(255, 255, 102, 1)",
                        "rgba(102, 255, 255, 1)",
                        "rgba(255, 102, 102, 1)",
                        "rgba(102, 102, 255, 1)",
                        "rgba(255, 153, 51, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
