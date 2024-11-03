import { CloseSquareOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Rate,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { createRoom, deleteRoom, getRooms, updateRoom } from "../apis/room";
import { getRoomTypes } from "../apis/roomType";
import { GetListParamsRoom, Room, RoomForm } from "../types/room";

export default function ListRoom() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetListParamsRoom>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    sortBy: "desc",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>();

  const { data, isLoading } = useQuery({
    queryKey: ["Rooms", JSON.stringify(params)],
    queryFn: () => getRooms(params),
  });

  const { data: roomTypes } = useQuery({
    queryKey: ["RoomTypes"],
    queryFn: () => getRoomTypes({ page: 1, limit: 0 }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Rooms"],
      });
      message.success("Room deleted successfully");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onTableChange: TableProps<Room>["onChange"] = (
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
      roomType: filters.roomType?.[0] as string,
    });
  };

  const columns: TableProps<Room>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "Roomname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Room type",
      dataIndex: "roomType",
      key: "roomType",
      render: (roomType) => roomType.name,
      filters: roomTypes?.data.map((item) => ({
        text: item.name,
        value: item._id,
      })),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Typography.Text strong>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </Typography.Text>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Discount",
      key: "discount",
      dataIndex: "discount",
      render: (discount) => <Tag color="green">{discount}%</Tag>,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Rating",
      key: "rating",
      dataIndex: "rating",
      render: (rating) => <Rate disabled value={rating} />,
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
              setSelectedRoom(record);
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
              {`Rooms (${data?.total || 0})`}
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => {
                setSelectedRoom(undefined);
                setOpenModal(true);
              }}
            >
              Create Room
            </Button>
            <Input.Search
              placeholder="Search Room"
              onSearch={(v) => {
                setParams({
                  ...params,
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
      <RoomModal
        open={openModal}
        setOpen={(value) => setOpenModal(value)}
        room={selectedRoom}
      />
    </>
  );
}

type RoomModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  room?: Room;
};

/**
 * Offered Amenities gồm: 
+ Wifi
+ Hair dryer
+ Swimming pool 
+ Mineral water
+ Towels
+ Personal hygiene kit
+ Air-conditioner 
+ Fridge
+ TV
 */

const OFFERED_AMENITIES = [
  { label: "Free Wi-Fi", value: "wifi" },
  { label: "Hair dryer", value: "hairDryer" },
  { label: "Swimming pool", value: "swimmingPool" },
  { label: "Mineral water", value: "mineralWater" },
  { label: "Towels", value: "towels" },
  { label: "Personal hygiene kit", value: "personalHygieneKit" },
  { label: "Air-conditioner", value: "airConditioner" },
  { label: "Fridge", value: "fridge" },
  { label: "TV", value: "tv" },
];

const RoomModal = ({ open, setOpen, room }: RoomModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<RoomForm>();
  const [photos, setPhotos] = useState(room?.photos || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPhotos(room?.photos || []);
    if (room) {
      form.setFieldsValue({
        name: room.name,
        roomType: room.roomType._id,
        price: room.price,
        discount: room.discount,
        offeredAmenities: room.offeredAmenities,
        description: room.description,
      });
    } else {
      form.resetFields();
    }
  }, [form, room]);

  const { data: roomTypes, isLoading } = useQuery({
    queryKey: ["RoomTypes"],
    queryFn: () => getRoomTypes({ page: 1, limit: 0 }),
  });

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: (Room: RoomForm) => createRoom(Room),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Rooms"],
      });
      message.success("Room created successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, room }: { id: string; room: RoomForm }) =>
      updateRoom(id, room),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Rooms"],
      });
      message.success("Room updated successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onCancel = () => {
    setOpen(false);
  };

  const onFinish = (values: RoomForm) => {
    if (room?._id) {
      update({ id: room._id, room: { ...values, photos } });
    } else {
      create({ ...values, photos });
    }
  };

  return (
    <Modal
      title={room?._id ? "Edit Room" : "Create Room"}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isPendingCreate || isPendingUpdate}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input room name!" }]}
        >
          <Input placeholder="Room name" />
        </Form.Item>
        <Form.Item
          name="roomType"
          label="Room type"
          rules={[{ required: true, message: "Please select room type!" }]}
        >
          <Select
            loading={isLoading}
            placeholder="Select room type"
            options={roomTypes?.data.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber placeholder="Price" style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item name="discount" label="Discount">
          <InputNumber
            placeholder="Discount"
            style={{ width: "100%" }}
            min={0}
            max={100}
          />
        </Form.Item>
        <Form.Item name="offeredAmenities" label="Offered Amenities">
          <Select
            mode="multiple"
            placeholder="Select offered amenities"
            options={OFFERED_AMENITIES}
          />
        </Form.Item>
        <Form.Item name="photos" label="Photos">
          <Upload
            multiple
            action="http://localhost:8080/api/uploads"
            name="photos"
            onChange={async (info) => {
              if (info.file.status === "done") {
                const newFile = info.file.response.data[0];
                setPhotos((prev) => [...prev, newFile]);
                setUploading(false);
              }
              if (info.file.status === "uploading") {
                setUploading(true);
              }
            }}
            showUploadList={false}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading}
              style={{ marginBottom: 12 }}
            >
              Upload
            </Button>
          </Upload>
          <Row gutter={[6, 6]}>
            {photos.map((url) => (
              <Col span={6} key={url} style={{ position: "relative" }}>
                <Image
                  src={url}
                  alt="photo"
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                  }}
                />
                <CloseSquareOutlined
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "#fff",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPhotos((prev) => prev.filter((item) => item !== url));
                  }}
                />
              </Col>
            ))}
          </Row>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
