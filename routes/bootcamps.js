const express = require('express')
const router = express.Router()

// //get all bootcamps
// router.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: 'all bootcamps'
//   })
// });
// //get bootcamp by id
// router.get('/:id', (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `get bootcamp ${req.params}`
//   })
// });
// //crete a bootcamp
// router.post('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: 'created a bootcamp'
//   })
// });
// //edit/update a bootcamp
// router.put('/:id', (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `update bootcamp ${req.params.id}`
//   })
// });
// //delete a bootcamp
// router.delete('/:id', (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `delete bootcamp ${req.params.id}`
//   })
// });
router.get('/', (req, res) => {
  res.json({
    msg: 'all bootcamps'
  })
})
router.get('/:id', (req, res) => {
  res.json({
    msg: `bootcamp ${req.params.id}`
  })
})
router.post('/', (req, res) => {
  res.json({
    msg: 'post'
  })
})
router.put('/:id', (req, res) => {
  res.json({
    msg: `update ${req.params.id}`
  })
});
router.delete('/:id', (req, res) => {
  res.json({
    msg: `delete ${req.params.id}`
  })
});

module.exports = router;