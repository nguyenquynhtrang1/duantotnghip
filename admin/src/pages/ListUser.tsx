import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { GetListParamsUser, User, UserForm } from "../types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getProfile,
  getUsers,
  updateUser,
} from "../apis/user";

export default function ListUser() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetListParamsUser>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    sortBy: "desc",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  const { data, isLoading } = useQuery({
    queryKey: ["users", JSON.stringify(params)],
    queryFn: () => getUsers(params),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      message.success("User deleted successfully");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onTableChange: TableProps<User>["onChange"] = (
    pagination,
    _,
    sorter
  ) => {
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
      orderBy: Array.isArray(sorter) ? undefined : (sorter.field as string),
      sortBy: Array.isArray(sorter)
        ? undefined
        : sorter.order === "ascend"
        ? "asc"
        : "desc",
    });
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Permission",
      key: "isAdmin",
      dataIndex: "isAdmin",
      render: (isAdmin) => <Tag>{isAdmin ? "ADMIN" : "USER"}</Tag>,
    },
    {
      title: "CreatedAt",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
      sorter: true,
      defaultSortOrder: "descend",
    },
    {
      title: "UpdatedAt",
      key: "updatedAt",
      dataIndex: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
      sorter: true,
      defaultSortOrder: "descend",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSelectedUser(record);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              mutate(record._id);
            }}
          >
            <Button
              danger
              disabled={profile?.data._id === record._id}
              loading={isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space align="center">
            <Typography.Text italic strong style={{ fontSize: 20 }}>
              {`Users (${data?.total || 0})`}
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => {
                setSelectedUser({} as User);
                setOpenModal(true);
              }}
            >
              Create User
            </Button>
            <Input.Search
              placeholder="Search User"
              onSearch={(v) => {
                setParams({
                  ...params,
                  page: 1,
                  search: v,
                });
              }}
              allowClear
            />
          </Space>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data?.data}
            loading={isLoading}
            onChange={onTableChange}
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: data?.total,
            }}
          />
        </Col>
      </Row>
      <UserModal
        open={openModal}
        setOpen={(value) => setOpenModal(value)}
        user={selectedUser}
      />
    </>
  );
}

type UserModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  user?: User;
};
const UserModal = ({ open, setOpen, user }: UserModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UserForm>();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      });
    } else {
      form.resetFields();
    }
  }, [form, user]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: (user: UserForm) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      message.success("User created successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserForm }) =>
      updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      message.success("User updated successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onCancel = () => {
    setOpen(false);
  };

  const onFinish = (values: UserForm) => {
    if (user?._id) {
      update({ id: user._id, user: values });
    } else {
      create(values);
    }
  };

  return (
    <Modal
      title={user?._id ? "Edit user" : "Create user"}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isPendingCreate || isPendingUpdate}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input placeholder="Phone" />
        </Form.Item>
        {!user?._id && (
          <>
            <Form.Item
              name="password"
              required
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
          </>
        )}
        <Form.Item name="isAdmin" label="Permission">
          <Radio.Group defaultValue={false}>
            <Radio.Button value={true}>Admin</Radio.Button>
            <Radio.Button value={false}>User</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
