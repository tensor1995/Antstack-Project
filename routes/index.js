const mongoose = require('mongoose');
const Coupon = mongoose.model("Coupouns");
const express = require("express");
const app = express.Router();

app.get('/', async (req, res) => {
      const result = await Coupon.find();
      res.json(result);
})


app.post('/', async (req, res) => {
      const {
            name,
            startDate,
            endDate,
            minAmt,
            type,
            discount
      } = req.body;

      const coupon = new Coupon({
            name,
            startDate,
            endDate,
            minAmt,
            type,
            discount
      })
      const result = await coupon.save()
      res.json(result)
})

app.delete('/:name', async (req, res) => {
      const coupon = await Coupon.deleteOne({ name: req.params.name })
      res.json(coupon)
}
)

module.exports = app