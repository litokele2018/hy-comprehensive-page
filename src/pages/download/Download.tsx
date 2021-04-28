import React, { useEffect, useRef, useState } from "react";
import styles from "./Download.scss";
import {
  Form,
  Input,
  Button,
  Card,
  Avatar,
  Modal,
  Popconfirm,
  Progress,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import classnames from "classnames";
import axios from "axios";

import io from "socket.io-client";

const socket = io("http://localhost:8081/");

const { Meta } = Card;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

const Home: React.FC = () => {
  const ref = useRef(null);
  const detailRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [downloadInfo, setDownloadInfo] = useState([]);

  const [main, setMain] = useState({});
  const [details, setDetails] = useState<any[]>([]);

  const refreshData = ({
    season,
    count,
    progress,
    currProgress,
    total,
    mark,
    dirName,
  }) => {
    let temp = [...downloadInfo];
    temp[mark] = {
      season,
      count,
      progress,
      currProgress,
      total,
      mark,
      dirName,
    };
    setDownloadInfo(temp);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect");
    });
    socket.on("disconnect", () => {
      console.log("disconnect");
    });
    socket.on("downloadInfo", (data) => {
      refreshData(data);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("downloadInfo");
    };
  });

  const handleCancel = () => {
    setVisible(false);
  };
  const handleSubmit = () => {
    ref.current
      .validateFields()
      .then((values) => {
        console.log("success", values);
        setMain(values);
        setDisable(true);
      })
      .catch((errorInfo) => {
        console.log("fail", errorInfo);
      });
  };
  const handleOk = () => {
    detailRef.current
      .validateFields()
      .then((values) => {
        console.log("success", values);
        setVisible(false);
        const { pageNum, name = "", episodes, season } = values;
        setDetails([...details, { pageNum, episodes, name, season }]);
      })
      .catch((errorInfo) => {
        console.log("fail", errorInfo);
      });
  };
  const handleCancelDetail = (index: number): void => {
    setDetails([...details.filter((item, i) => i !== index)]);
  };

  const handleDownload = () => {
    if (Object.keys(main).length && details.length) {
      axios.post("http://localhost:8080/download", {
        data: { main, details },
        withCredentials: true,
        headers: {
          "Content-type": "application/json",
        },
      });
    }
  };
  return (
    <div>
      <div className={styles["hy-card"]}>
        <div className={styles["hy-img-wrapper"]}>主要参数</div>
        <Form {...layout} ref={ref} name="control-ref" onFinish={() => {}}>
          <Form.Item name="title" label="title" rules={[{ required: true }]}>
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item
            name="totalSeason"
            label="totalSeason"
            rules={[{ required: true }]}
          >
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item
            name="limit"
            label="limit"
            rules={[{ required: true }]}
          >
            <Input disabled={disable} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                setDisable(false);
              }}
            >
              edit
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={() => {
                ref.current
                  .validateFields()
                  .then((values) => {
                    console.log("success", values);
                    setDisable(true);
                    setVisible(!visible);
                  })
                  .catch((errorInfo) => {
                    console.log("fail", errorInfo);
                  });
              }}
            >
              add details
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles["hy-card-wrapper"]}>
        {details.map((item, index) => (
          <Card
            style={{ maxWidth: 200 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
              <Popconfirm
                title="Are you sure？"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => handleCancelDetail(index)}
              >
                <CloseCircleOutlined key="close" style={{ color: "red" }} />
              </Popconfirm>,
              ,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={"name:" + item.name}
              description={
                <div>
                  <p>season：{item.season}</p>
                  <p>页面：{item.pageNum}</p>
                  <p>集数：{item.episodes}</p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
      <div className={classnames(styles["hy-card"], styles["hy-download-btn"])}>
        <Button type="primary" onClick={handleDownload}>
          Start Download
        </Button>
      </div>
      <div className={classnames(styles["hy-card"], styles["hy-progress"])}>
        {downloadInfo.map(
          (item, index) =>
            item && (
              <div key={index}>
                {item.dirName}-{item.season}-{item.count} current：
                {item.currProgress}M total：
                {item.total}M
                <Progress
                  percent={item.progress}
                  status={item.progress == 100 ? "success" : "active"}
                />
              </div>
            )
        )}
      </div>
      <Modal
        visible={visible}
        title="Anime Detail"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form {...layout} ref={detailRef}>
          <Form.Item
            name="episodes"
            label="episodes"
            rules={[{ required: true }]}
          >
            <Input placeholder="total episodes count"></Input>
          </Form.Item>
          <Form.Item
            name="pageNum"
            label="pageNum"
            rules={[{ required: true }]}
          >
            <Input placeholder="如“58175”" />
          </Form.Item>
          <Form.Item name="season" label="season" rules={[{ required: true }]}>
            <Input placeholder="input season" />
          </Form.Item>
          <Form.Item name="name" label="name">
            <Input placeholder="not neccessary"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
