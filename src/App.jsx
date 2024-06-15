import { useState } from 'react'
import moment from 'jalali-moment';
import "jalaali-react-date-picker/lib/styles/index.css";
import './App.scss'
import { RangePicker, InputRangePicker, DatePicker } from "jalaali-react-date-picker";
import { Button, Form, Input, Row, Col, Spin, message, Space } from 'antd';
import { getRequest, postRequest } from './API.js'
function App() {
  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    return previous.toISOString().slice(0, 10);
  }
  function stringToDate(date) {
    var currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString().slice(0, 10);

  }
  function getShamsi(date) {
    return moment(date).locale('fa').format('YYYY-MM-DD')
  }
  const users = {
    'mehrshad': {
      password: 'mehr'
    },
    'shahrzad.a': {
      password: 'alireza2150973'
    },
    'admin': {
      password: 'admin'
    },
  }
  const onFinish = async (values) => {
    if (Object.keys(users).includes(values.username)) {// && values.password === users[values.username].password) {
      messageApi.info({
        content: <span dir='rtl'>در حال دریافت {urls[element]} - {today}</span>,
        duration: 10,
      });
      // all reports
      if (element === 'all') {
        setLoading(true)
        console.log(1)
        await Promise.all(Object.keys(urls).slice(0, -1).map(async (key) => {
          if (await getRequest(key, mdate, today))
            messageApi.success({
              content: <span dir='rtl'>دریافت {urls[key]} - {today} با موفقیت انجام شد</span>,
            });
          else
            messageApi.error({
              content: <span dir='rtl'>دریافت {urls[key]} - {today} با خطا مواجه شد</span>,
            });
        }))
        console.log(2)
        setLoading(false)
      }
      // specific reports
      else {
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
  const [mdate, setMdate] = useState(getPreviousDay())
  const [today, setToday] = useState(getShamsi(mdate))
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
      <h1>صفحه گزارشات جت</h1>
      <h4>{mdate} | {today}</h4>
      <div className="card">
        <Form
          name="basic"
          onFinish={onFinish}
          layout='vertical'
          autoComplete="off"
          disabled={loading}
          style={{
            width: '52vw',
            minWidth: '570px',
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Space
                direction="vertical"
                size='large'
                style={{
                  display: 'flex',
                  height: '100%',
                }}
              >
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
              </Space>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
              >
                {/* <RangePicker defaultValue={[moment(), moment().add(1, 'days')]} /> */}
                <DatePicker defaultValue={moment().add(-1, 'days')} disabledDates={
                  (current) => current && current.isAfter(moment().add(-1, 'days'))} onChange={d => {
                    setMdate(stringToDate(d));
                    setToday(getShamsi(stringToDate(d)));
                    console.log(stringToDate(d));
                  }} className='datePicker' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
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
            <Col span={12}>
              <Form.Item>
                <Button size='large' onClick={() => setElement('all')} htmlType='submit'>
                  دریافت همه گزارشات
                </Button>
              </Form.Item>
            </Col>
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
