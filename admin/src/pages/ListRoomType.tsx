import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createRoomType,
  deleteRoomType,
  getRoomTypes,
  updateRoomType,
} from "../apis/roomType";
import {
  GetListParamsRoomType,
  RoomType,
  RoomTypeForm,
} from "../types/roomType";

export default function ListRoomType() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetListParamsRoomType>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    sortBy: "desc",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>();

  const { data, isLoading } = useQuery({
    queryKey: ["RoomTypes", JSON.stringify(params)],
    queryFn: () => getRoomTypes(params),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["RoomTypes"],
      });
      message.success("RoomType deleted successfully");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onTableChange: TableProps<RoomType>["onChange"] = (
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

  const columns: TableProps<RoomType>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
              setSelectedRoomType(record);
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
              {`RoomTypes (${data?.total || 0})`}
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => {
                setSelectedRoomType(undefined);
                setOpenModal(true);
              }}
            >
              Create RoomType
            </Button>
            <Input.Search
              placeholder="Search RoomType"
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
      <RoomTypeModal
        open={openModal}
        setOpen={(value) => setOpenModal(value)}
        roomType={selectedRoomType}
      />
    </>
  );
}

type RoomTypeModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  roomType?: RoomType;
};
const RoomTypeModal = ({ open, setOpen, roomType }: RoomTypeModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<RoomTypeForm>();

  useEffect(() => {
    if (roomType) {
      form.setFieldsValue({
        name: roomType.name,
        description: roomType.description,
      });
    } else {
      form.resetFields();
    }
  }, [form, roomType]);

  const { mutate: create, isPending: isPendingCreate } = useMutation({
    mutationFn: (RoomType: RoomTypeForm) => createRoomType(RoomType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["RoomTypes"],
      });
      message.success("RoomType created successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const { mutate: update, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, RoomType }: { id: string; RoomType: RoomTypeForm }) =>
      updateRoomType(id, RoomType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["RoomTypes"],
      });
      message.success("RoomType updated successfully");
      onCancel();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onCancel = () => {
    setOpen(false);
  };

  const onFinish = (values: RoomTypeForm) => {
    if (roomType?._id) {
      update({ id: roomType._id, RoomType: values });
    } else {
      create(values);
    }
  };

  return (
    <Modal
      title={roomType?._id ? "Edit RoomType" : "Create RoomType"}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isPendingCreate || isPendingUpdate}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input placeholder="RoomTypename" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
