var express = require("express");
var router = express.Router();
const projects = require("../models/project_details");

// route --> localhost:3000/home
router.get("/", async (req, res) => {
  const userData = await projects.find({}).sort({createdAt: 'desc'});
  if(userData)
  {
    res.render('home/home',{proj:userData})
  }
});

// route --> localhost:3000/home
router.post("/", async (req, res) => {
  let year = req.body.year;
  let acad = req.body.academic;
  let sem = req.body.semester;

  if (!year) {
    year = "";
  }
  if (!acad) {
    acad = "";
  }
  if (!sem) {
    sem = "";
  }

  if (year != "" && acad != "" && sem != "") {
    var filterParameter = {
      $and: [{ currYear: year }, { academic: acad }, { semester: sem }],
    };
  } else if (year == "" && acad != "" && sem != "") {
    var filterParameter = { $and: [{ academic: acad }, { semester: sem }] };
  } else if (year != "" && acad == "" && sem != "") {
    var filterParameter = { $and: [{ currYear: year }, { semester: sem }] };
  } else if (year != "" && acad != "" && sem == "") {
    var filterParameter = { $and: [{ currYear: year }, { academic: acad }] };
  } else if (year == "" && acad == "" && sem != "") {
    var filterParameter = { $and: [{ semester: sem }] };
  } else if (year == "" && acad != "" && sem == "") {
    var filterParameter = { $and: [{ academic: acad }] };
  } else if (year != "" && acad == "" && sem == "") {
    var filterParameter = { $and: [{ currYear: year }] };
  } else {
    var filterParameter = {};
  }
  const projectFilter = await projects.find(filterParameter);
  res.render("home/home", { proj: projectFilter });
});

router.get("/download/report", (req, res) => {
  const filePath = "public/sampleFiles/report.pdf";
  res.download(
      filePath, 
      "Sample-Report.pdf", // Remember to include file extension
      (err) => {
          if (err) {
              res.send({
                  msg   : "Problem downloading the file"
              })
          }
  });
});

router.get("/download/reportTemplate", (req, res) => {
  const filePath = "public/sampleFiles/ReportTemplate.docx";
  res.download(
      filePath, 
      "Report-Template.docx", // Remember to include file extension
      (err) => {
          if (err) {
              res.send({
                  msg   : "Problem downloading the file"
              })
          }
  });
});

module.exports = router;
