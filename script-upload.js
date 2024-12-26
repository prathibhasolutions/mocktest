
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");

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

    // Hardcoded list of images in your folder
    const images = [

    ];

    if (images.length === 0) {
      alert("No question images found.");
      return;
    }

    // Prepare image data for localStorage
    const imagesData = images.map((image) => {
      return {
        name: image,
        data: image // The relative path to the image
      };
    });

    // Store all data in localStorage
    localStorage.setItem("studentName", studentName);
    localStorage.setItem("examName", examName);
    localStorage.setItem("examTimer", examTimer);
    localStorage.setItem("questionImages", JSON.stringify(imagesData));

    alert("Are you sure to start the mock test!");
    window.location.href = "mock-test.html";
  });
});




