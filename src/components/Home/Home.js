import { Button, Form, Input } from "antd";
import React from "react";
import "./Home.scss";

const Home = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      className="home"
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <h2>4 EN RAYA</h2>
      <Form.Item
        label="Nick:"
        name="nick"
        rules={[
          {
            required: true,
            message: "Por favor ingrese su nombre!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
          sm: 3,
        }}
      >
        <Button type="primary" htmlType="submit">
          Jugar!
        </Button>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Buscar partida pública
        </Button>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Crear partida privada
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Home;
