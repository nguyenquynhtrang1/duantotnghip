import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
} from "../apis/booking";
import { getAllRooms } from "../apis/room";
import { getUsers } from "../apis/user";
import {
  Booking,
  BookingForm,
  BookingStatusForm,
  GetListParamsBooking,
} from "../types/booking";
import dayjs from "dayjs";

export default function ListBooking() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetListParamsBooking>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    sortBy: "desc",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();

  const { data, isLoading } = useQuery({
    queryKey: ["Bookings", JSON.stringify(params)],
    queryFn: () => getBookings(params),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["Rooms"],
      });
      message.success("Booking deleted successfully");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onTableChange: TableProps<Booking>["onChange"] = (
    pagination,
    filters,
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

  const columns: TableProps<Booking>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => <a>{user.email}</a>,
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room) => <a>{room.name}</a>,
    },
    {
      title: "Room type",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "Checkin",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (checkIn) => new Date(checkIn).toLocaleDateString(),
    },
    {
      title: "Checkout",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (checkOut) => new Date(checkOut).toLocaleDateString(),
    },
    {
      title: "Total cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (totalCost) => (
        <Typography.Text strong>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalCost)}
        </Typography.Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "geekblue";
        if (status === "Cancelled") {
          color = "volcano";
        } else if (status === "Confirmed") {
          color = "green";
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.status !== "Pending"}
            onClick={() => {
              setSelectedBooking(record);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => mutate(record._id)}
          >
            <Button danger loading={isPending}>
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
              {`Bookings (${data?.total || 0})`}
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => {
                setSelectedBooking({} as Booking);
                setOpenModal(true);
              }}
            >
              Create Booking
            </Button>
            <Input.Search
              placeholder="Search Booking"
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
      <BookingModal
        open={openModal}
        setOpen={(value) => setOpenModal(value)}
        booking={selectedBooking}
      />
    </>
  );
}

type BookingModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  booking?: Booking;
};
const BookingModal = ({ open, setOpen, booking }: BookingModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<BookingForm>();

  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["AllRooms"],
    queryFn: () => getAllRooms(),
  });
  const selectedRoomId = Form.useWatch("roomId", form);
  const selectedRoom = rooms?.data.find((item) => item._id === selectedRoomId);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["Users"],
    queryFn: () => getUsers({ page: 1, limit: 0 }),
  });
  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        status: booking.status,
      });
    } else {
      form.resetFields();
    }
  }, [form, booking]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: (Booking: BookingForm) => createBooking(Booking),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["Rooms"],
      });
      message.success("Booking created successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, booking }: { id: string; booking: BookingStatusForm }) =>
      updateBooking(id, booking),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Bookings"],
      });
      message.success("Booking updated successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    if (booking?._id) {
      update({ id: booking._id, booking: values });
    } else {
      create({
        userId: values.userId,
        roomId: values.roomId,
        checkIn: values.date[0].toISOString(),
        checkOut: values.date[1].toISOString(),
      });
    }
  };

  return (
    <Modal
      title={booking?._id ? "Edit Booking" : "Create Booking"}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isPendingCreate || isPendingUpdate}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {booking?._id ? (
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Confirmed">Confirmed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        ) : (
          <>
            <Form.Item
              name="roomId"
              label="Room"
              rules={[{ required: true, message: "Please select room!" }]}
            >
              <Select
                placeholder="Select room"
                options={rooms?.data.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                loading={isLoadingRooms}
              />
            </Form.Item>
            <Form.Item
              name="userId"
              label="User"
              rules={[{ required: true, message: "Please select user!" }]}
            >
              <Select
                placeholder="Select user"
                options={users?.data.map((item) => ({
                  label: item.email,
                  value: item._id,
                }))}
                loading={isLoadingUsers}
              />
            </Form.Item>
            <Form.Item
              label="Date picker"
              name="date"
              rules={[
                {
                  type: "array" as const,
                  required: true,
                  message: "Please select time!",
                },
              ]}
            >
              <DatePicker.RangePicker
                disabledDate={(current) =>
                  (current && current < dayjs().startOf("day")) ||
                  (current &&
                    (selectedRoom?.invalidDates
                      .map((date) => dayjs(date))
                      .some((date) => date.isSame(current, "day")) as boolean))
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};
