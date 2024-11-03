import {
  Button,
  Col,
  Input,
  message,
  Popconfirm,
  Rate,
  Row,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteReview, getReviews } from "../apis/review";
import { GetListParamsReview, Review } from "../types/review";

export default function ListReviews() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<GetListParamsReview>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    sortBy: "desc",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["Reviews", JSON.stringify(params)],
    queryFn: () => getReviews(params),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Reviews"],
      });
      message.success("Review deleted successfully");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onTableChange: TableProps<Review>["onChange"] = (
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

  const columns: TableProps<Review>["columns"] = [
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
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate value={rating} disabled />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="center">
          <Typography.Text italic strong style={{ fontSize: 20 }}>
            {`Reviews (${data?.total || 0})`}
          </Typography.Text>
          <Input.Search
            placeholder="Search Review"
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
  );
}
