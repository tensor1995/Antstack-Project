
import React, { Component } from 'react'
import ReactSearchBox from 'react-search-box'
import './App.css'
import axios from 'axios'
import _ from "lodash";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartAmount: 0,
      data: [],
      coupons: [],
      valueAfterDiscount: 0,
      couponName: '',
      couponType: '',
      expiryDate: '',
      minPurchase: 0,
      discount: 0,
      couponApplied: false,
      isButtonDisabled:true
    }
  }
  async componentDidMount() {
    const result = await axios.get('https://antcoupon.herokuapp.com/crud')
    this.setState({ coupons: result.data })
    console.log(this.state.coupons, "in mount");
  }
  renderContent() {
    return _.map(
      this.state.coupons,
      (coupon) => {
        return (
          <div className="card blue-grey darken-1" key={coupon._id}>

            <div className="card-content">
              <span className="card-title">{coupon.name}</span>
              <span>{coupon.minAmt}</span>
              <span>{coupon.type === "FLAT" ? "Rs " + coupon.discount + " off" : coupon.discount + "% off"}</span>
              <span className="right">
                {new Date(coupon.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      }
    );
  }

  getData = async () => {
    const result = await axios.get('https://antcoupon.herokuapp.com/crud')
    let formatData = result.data.map((row, index) => {
      return {
        key: `${index + 1}`,
        value: row.name
      }
    })
    this.setState({coupons:result.data})
    this.setState({ data: formatData })
    console.log("mounted", formatData);
  }

  handleChange = event => {
    console.log(event.target);
    const key = event.target.name
    let state = this.state
    if (key === "couponName")
      this.setState({ ...state, couponName: event.target.value });
    if (key === "couponType")
      this.setState({ ...state, couponType: event.target.value });
    if (key === "expiryDate")
      this.setState({ ...state, expiryDate: event.target.value });
    if (key === "minPurchase")
      this.setState({ ...state, minPurchase: event.target.value });
    if (key === "discount")
      this.setState({ ...state, discount: event.target.value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("i'm in dada");
    const body = {
      name: this.state.couponName,
      type: this.state.couponType,
      endDate: this.state.expiryDate,
      minAmt: this.state.minPurchase,
      discount: this.state.discount
    }
    console.log(body);
    const result = await axios.post('https://antcoupon.herokuapp.com/coupon/create', body)
    console.log(result.data);
    this.setState({
      couponName: '',
      couponType: '',
      expiryDate: '',
      minPurchase: 0,
      discount: 0,
        
    })

    this.getData()
    

  }
  handleSelect = event => {
    event.preventDefault();
  }

  render() {
    return (
      <div style={{ padding: '50px' }}>
        <div className="card-content">
          <ReactSearchBox
            placeholder="Search for coupon and select to apply"
            data={this.state.data}
            onSelect={async (record) => {
              console.log(record.value, this.state.cartAmount)
              const discount = await axios.post('https://antcoupon.herokuapp.com/coupon', { cartAmount: this.state.cartAmount, couponCode: record.value })
              console.log("discount", discount.data);
              if (discount.data.valid) {
                toast.success("Coupon successfully applied", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
              if (!discount.data.valid) {
                toast.error("Coupon not applied, it might have expired", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }

              this.setState({ ...this.state, valueAfterDiscount: discount.data.valueAfterFlat, couponApplied: discount.data.valid })
            }}
            onFocus={async () => {
              console.log('This function is called when is focussed')
              await this.getData()
            }}
            onChange={value => console.log(value)}
            fuseConfigs={{
              threshold: 0.05,
            }}
            value={this.state.couponCode}

          />
<ToastContainer/>
        </div>

        <div style={{ textAlign: 'center', width: '50%', margin: '0 auto', flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', paddingTop: '50px' }}>

          <button className="minus" onClick={(e) => {
            e.preventDefault()
            if (!this.state.cartAmount <= 0)
              this.setState({
                cartAmount: this.state.cartAmount - 50
              })
          }}>-</button>
          <button className="plus" onClick={(e) => {
            e.preventDefault()
            this.setState({
              cartAmount: this.state.cartAmount + 50
            })
          }}> +</button>
          <button onClick={() => {
            this.setState({ couponApplied: false, data: [],cartAmount:0 })
          }}>
            Reset
      </button>
          <div>
            {this.state.couponApplied ?
              <div>
                valueAfterDiscount = {this.state.valueAfterDiscount === this.state.cartAmount ? <p>coupon code is expired</p> : this.state.valueAfterDiscount}
              </div> : ''}
            <div>cartAmount = {this.state.cartAmount}
            </div>
          </div>
        </div>

        <div className='coupon-div'>
          <h2>Create Coupon</h2>

          <form>
            <label >Coupon Name</label><br />
            <input type="text" id="couponName" name="couponName" value={this.state.couponName}
              onChange={(e) => {
                this.handleChange(e)
              }}
            /><br />
            <label >Type</label><br />
            <input type="text" id="couponType" name="couponType" value={this.state.couponType}
              onChange={(e) => {
                this.handleChange(e)
              }} /><br />
            <label >Expiry Date</label><br />
            <input type="date" id="expiryDate" name="expiryDate" value={this.state.expiryDate}
              onChange={(e) => {
                this.handleChange(e)
              }} /><br />
            <label>Minimum Purchase Amount</label><br />
            <input type="number" id="minPurchase" name="minPurchase" value={this.state.minPurchase}
              onChange={(e) => {
                this.handleChange(e)
              }} /><br />
            <label >Discount Amount</label><br />
            <input type="number" id="discount" name="discount" value={this.state.discount}
              onChange={(e) => {
                this.handleChange(e)
              }} /><br /><br />
            <button type="submit"  onClick={async (e) => { 
              this.handleSubmit(e)
               }}> Create </button>

          </form>
        </div>

        <div className="lists">
          <h2 className="head">Coupon List</h2>
          <div className="card-content">
            <span className="">Coupon name</span>
            <span>Minimum Purchase</span>
            <span>Discount</span>
            <span>Expires On</span>
          </div>
          {this.renderContent()}
        </div>



      </div>
    )
  }
}