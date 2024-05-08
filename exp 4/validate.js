<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Validation</title>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <!-- Custom CSS -->
  <style>
    .error {
      color: red;
      font-size: 12px;
    }

    /* Add border color for invalid inputs */
    input:invalid {
      border: 1px solid red;
    }
  </style>
</head>
<body>
  <div class="container mt-5">
    <form id="registrationForm">
      <table class="table">
        <tbody>
          <tr>
            <td><label for="fullName">Full Name:</label></td>
            <td><input type="text" class="form-control" id="fullName" name="fullName" required></td>
            <td><div class="error" id="fullNameError"></div></td>
          </tr>
          <tr>
            <td><label for="email">Email:</label></td>
            <td><input type="email" class="form-control" id="email" name="email" required></td>
            <td><div class="error" id="emailError"></div></td>
          </tr>
          <tr>
            <td><label for="password">Password:</label></td>
            <td><input type="password" class="form-control" id="password" name="password" required></td>
            <td><div class="error" id="passwordError"></div></td>
          </tr>
          <tr>
            <td><label for="panCard">PAN Card Number:</label></td>
            <td><input type="text" class="form-control" id="panCard" name="panCard" required></td>
            <td><div class="error" id="panCardError"></div></td>
          </tr>
          <tr>
            <td><label for="aadhar">Aadhar Number:</label></td>
            <td><input type="text" class="form-control" id="aadhar" name="aadhar" required></td>
            <td><div class="error" id="aadharError"></div></td>
          </tr>
          <tr>
            <td><label for="phone">Phone Number:</label></td>
            <td><input type="tel" class="form-control" id="phone" name="phone" required></td>
            <td><div class="error" id="phoneError"></div></td>
          </tr>
        </tbody>
      </table>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  <!-- Custom JavaScript -->
  <script>
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
      let isValid = true;

      // Reset error messages
      document.querySelectorAll('.error').forEach(function(element) {
        element.textContent = '';
      });

      // Full Name validation
      const fullName = document.getElementById('fullName').value;
      if (!fullName.trim()) {
        document.getElementById('fullNameError').textContent = 'Full Name is required';
        isValid = false;
      }

      // Email validation
      const email = document.getElementById('email').value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        isValid = false;
      }

      // Password validation (minimum 8 characters and at least one numeric digit)
      const password = document.getElementById('password').value;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long and contain at least one numeric digit';
        isValid = false;
      }

      // PAN Card validation
      const panCard = document.getElementById('panCard').value;
      const panCardRegex = /^\d{11}$|^\d{16}$/;
      if (!panCardRegex.test(panCard)) {
        document.getElementById('panCardError').textContent = 'Enter a valid PAN Card number (11 or 16 digits)';
        isValid = false;
      }

      // Aadhar Number validation
      const aadhar = document.getElementById('aadhar').value;
      const aadharRegex = /^\d{12}$/;
      if (!aadharRegex.test(aadhar)) {
        document.getElementById('aadharError').textContent = 'Enter a valid Aadhar number (12 digits)';
        isValid = false;
      }

      // Phone Number validation
      const phone = document.getElementById('phone').value;
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').textContent = 'Enter a valid 10-digit phone number';
        isValid = false;
      }

      // Prevent form submission if validation fails
      if (!isValid) {
        event.preventDefault();
      }
    });
  </script>
</body>
</html>
