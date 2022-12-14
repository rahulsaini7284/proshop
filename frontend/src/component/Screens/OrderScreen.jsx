import React, { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { Button, Image, Col, ListGroup, Row, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../Screens/Message";
import Loading from "./Loading";
import axios from "axios";
import {
  getOrderDetailsAction,
  payOrder,
} from "../../REDUX/actions/orderActions";
import { ORDER_PAY_RESET } from "../../REDUX/constants/orderConstants";

export const GetOrderDetails = () => {
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderID = useParams().id;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  const LoginUser = useSelector((state) => state.LoginUser);
  const { userInfo } = LoginUser;
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, status: statusPay } = orderPay;
  console.log(order);
  useEffect(() => {
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get(
        "http://localhost:5911/api/config/paypal"
      );
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!userInfo) {
      navigate("/signIn");
    }
    if (!order || order._id !== orderID || statusPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetailsAction(orderID));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [order, orderID, dispatch, statusPay]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    console.log(order);
    dispatch(payOrder(orderID, paymentResult));
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Message varient={"danger"} message={error} />
  ) : (
    <>
      <Col md={9}>
        <h1>
          Order Id:{" "}
          <span style={{ fontWeight: "400", width: "100%" }}>{order._id}</span>
        </h1>
      </Col>
      <Col md={3}>
        <Link to={"/profile"}>
          <Button className="my-3 ">
            <i class="fa-lg fa-solid fa-circle-arrow-left px-1"></i> Back
          </Button>
        </Link>
      </Col>
      <Row>
        <Col md={8}>
          <ListGroup variant={"flush"}>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.country},{order.shippingAddress.state},
                {order.shippingAddress.city},{order.shippingAddress.address},
                {order.shippingAddress.pincode},{order.shippingAddress.mobile}
                <p>
                  {order.isDelivered ? (
                    <Message
                      varient={"success"}
                      message={`Delivered on ${order.deliveredAt}`}
                    />
                  ) : (
                    <Message
                      varient={"danger"}
                      message={"Not Delivered So Far"}
                    />
                  )}
                </p>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order?.paymentMethod}
              </p>
              <p>
                {order.isPaid ? (
                  <Message
                    varient={"success"}
                    message={`Paid on ${order.paidAt}`}
                  />
                ) : (
                  <Message varient={"danger"} message={"Not Paid"} />
                )}
              </p>
            </ListGroup.Item>
            {order.orderItems.length === 0 ? (
              <Message varient={"warning"} message={"Your Cart is Empty"} />
            ) : (
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Items:</h2>
                </ListGroup.Item>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x &#x20B9;{item.price} = &#x20B9;
                        {item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summery</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>&#x20B9;{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#x20B9;{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>&#x20B9;{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#x20B9;{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay ? (
                    <Loading />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
