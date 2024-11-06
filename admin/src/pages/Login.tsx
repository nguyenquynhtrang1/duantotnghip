import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Input, message, Row, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../apis/auth";
import { getProfile } from "../apis/user";
import { LoginCredentials, LoginResponse } from "../types/user";
import logo from "../assets/logo.jpg";

export default function Login() {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (data && data.data.isAdmin) {
      navigate("/");
    }
  }, [data, navigate]);

  const { mutate } = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      return login(credentials);
    },
    onSuccess: (res: LoginResponse) => {
      if (res.data.user.isAdmin) {
        localStorage.setItem("access_token", res.data.token);
        localStorage.setItem("refresh_token", res.data.refreshToken);
        navigate("/");
      } else {
        message.error("You are not authorized to access this page");
      }
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onFinish = (values: LoginCredentials) => {
    mutate(values);
  };

  return (
    <Row style={{ height: "100vh" }}>
      <Col span={10}>
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <div style={{ textAlign: "center", maxWidth: 320 }}>
            <img src={logo} alt="logo" height={80} width={80} />
            <Typography.Title level={2} style={{}}>
              Sign in
            </Typography.Title>
            <Typography.Text italic>
              Welcome back to Kayla Homestay! Please enter your details below to
              sign in.
            </Typography.Text>
            <Form
              name="login"
              initialValues={{ remember: true }}
              style={{ maxWidth: 360, margin: "auto", marginTop: 24 }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Flex>
      </Col>
      <Col span={14}>
        <div style={{ position: "relative", height: "100%", display: "block" }}>
          <img
            src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613617/banner_jgn7st.jpg"
            alt="login"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              objectFit: "cover",
            }}
          />
        </div>
      </Col>
    </Row>
  );
}
