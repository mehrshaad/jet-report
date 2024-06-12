import { useState } from 'react'
import moment from 'jalali-moment';
import './App.scss'
import { Button, Form, Input, Row, Col, Spin, message } from 'antd';
import { getRequest, postRequest } from './API'
function App() {
  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    return previous.toISOString().slice(0, 10);
  }
  const users = {
    'mehrshad': {
      password: '123'
    },
    'shahrzad.a': {
      password: 'alireza2150973'
    },
    'admin': {
      password: 'admin'
    },
  }
  const onFinish = async (values) => {
    if (Object.keys(users).includes(values.username) && values.password === users[values.username].password) {
      messageApi.info({
        content: <span dir='rtl'>در حال دریافت {urls[element]} - {today}</span>,
        duration: 10,
      });
      setLoading(true)
      if (await getRequest(element, mdate, today))
        messageApi.success({
          content: <span dir='rtl'>دریافت {urls[element]} - {today} با موفقیت انجام شد</span>,
        });
      else
        messageApi.error({
          content: <span dir='rtl'>دریافت {urls[element]} - {today} با خطا مواجه شد</span>,
        });
      setLoading(false)
    }
    else {
      messageApi.error({
        content: <span dir='rtl'>نام کاربری یا رمز عبور اشتباه است</span>,
      });
    }
  };
  const [loading, setLoading] = useState(false)
  const [element, setElement] = useState('')
  const [messageApi, contextHolder] = message.useMessage();
  const mdate = getPreviousDay()
  const today = moment(mdate).locale('fa').format('YYYY-MM-DD')
  const urls = {
    'GetFinActPickupNewCommReportData': 'گزارش روزانه جمع آوری - مدل درآمدی جدید',
    'GetFinActDeliveryNewCommReportData': 'گزارش روزانه توزیع - مدل درآمدی جدید',
    'GetFinActPickupReportData': 'گزارش روزانه جمع آوری - مالی',
    'GetFinActDeliveryReportData': 'گزارش روزانه توزیع - مالی',
    'GetFinActEkhtetamReportData': 'گزارش روزانه اختتام',
    'GetFinActReturnReportData': 'گزارش روزانه عودتی',
    'GetFinActCODReportData': 'گزارش روزانه COD',
  }
  return (
    <>
      {contextHolder}
      <Spin spinning={loading} tip='...درحال دریافت گزارشات' fullscreen size="large" />
      <h1>Jet Reports</h1>
      <h4>{mdate} | {today}</h4>
      <div className="card">
        <Form
          name="basic"
          onFinish={onFinish}
          layout='vertical'
          autoComplete="off"
          disabled={loading}
          style={{
            width: '42vw',
            minWidth: '570px',
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: ''
                  },
                ]}
              >
                <Input size='large' placeholder='Username' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: ''
                  },
                ]}
              >
                <Input.Password size='large' placeholder='Password' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            {Object.keys(urls).map((key) =>
            (
              <Col span={12}>
                <Form.Item>
                  <Button size='large' loading={loading && key == element} onClick={() => setElement(key)} htmlType='submit'>
                    {urls[key]}
                  </Button>
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </div>
      <p className="read-the-docs">
        Developed By Ali Dadashzadeh
      </p>
    </>
  )
}

export default App
