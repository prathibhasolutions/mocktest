
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const questionImagesInput = document.getElementById("questionImages");

  generateBtn.addEventListener("click", () => {
    const studentName = document.getElementById("studentName").value.trim();
    const examName = document.getElementById("examName").value.trim();
    const examTimer = parseInt(document.getElementById("examTimer").value.trim(), 10);

    if (!studentName) {
      alert("Please enter your name.");
      return;
    }

    if (!examName) {
      alert("Please enter the exam name.");
      return;
    }

    if (!examTimer || examTimer <= 0) {
      alert("Please enter a valid timer duration in minutes.");
      return;
    }

    const files = Array.from(questionImagesInput.files);

    if (files.length === 0) {
      alert("Please upload at least one question image.");
      return;
    }

    const imagesData = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ name: file.name, data: e.target.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagesData).then((images) => {
      localStorage.setItem("studentName", studentName);
      localStorage.setItem("examName", examName);
      localStorage.setItem("examTimer", examTimer);
      localStorage.setItem("questionImages", JSON.stringify(images));
      alert("Are you sure to start the mock test! ");
      window.location.href = "mock-test.html";
    });
  });

  document.getElementById("answersKeyFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let keyData;
          if (file.name.endsWith(".json")) {
            keyData = JSON.parse(e.target.result);
          } else if (file.name.endsWith(".xlsx")) {
            const workbook = XLSX.read(e.target.result, { type: "binary" });
            keyData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          }
          localStorage.setItem("answersKey", JSON.stringify(keyData));
          alert("Answers key uploaded successfully!");
        } catch (err) {
          alert("Invalid file format.");
        }
      };
      if (file.name.endsWith(".xlsx")) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    }
  });
  
});



