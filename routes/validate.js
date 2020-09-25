const mongoose = require('mongoose');
const Coupon = mongoose.model("Coupouns");
const express = require("express");
var moment = require('moment'); // require
const app = express.Router();

app.post('/', async (req, res) => {
      const {
            cartAmount,
            couponCode
      } = req.body;

      const coupon = await Coupon.findOne({
            name: couponCode,
      })
      if (!coupon) {
            return res.json("Coupon doesnot exist")
      }
      let valid = false
      const startDate = moment(coupon.startDate)
      const endDate = moment(coupon.endDate)
      const withinDate = endDate.diff(Date.now())
      if (withinDate>0 && cartAmount>=coupon.minAmt) {
            valid = true
      }
      console.log( withinDate);
      let valueAfterFlat
      if (valid && coupon.type === 'FLAT' ) {
            valueAfterFlat = Number(cartAmount) -  coupon.discount;
           
      }
      if (valid && coupon.type === 'PERCENT') {
            valueAfterFlat = Number(cartAmount) -  Number( coupon.discount*cartAmount /100);
      }
      res.json({
            valueAfterFlat, valid
      });
})


app.post('/create', async (req, res) => {
      const {
            name,
            endDate,
            minAmt,
            type,
            discount
      } = req.body;

      const coupon = new Coupon({
            name,
            startDate:Date.now(),
            endDate,
            minAmt,
            type,
            discount
      })
      const result = await coupon.save()
      res.json(result)
})
module.exports = app