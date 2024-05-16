const form = document.querySelector('#appointment-form');
const uploadedImage = {};

scrollTop();
documentTypePicker();
formSubmit();

function formSubmit() {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    for (const element of form.elements) {
      if (element.type === 'submit' || element.type === 'reset') continue;

      if (isInvalid(element)) {
        valid = false;
      }
    }

    if (grecaptcha.getResponse() == "") {
      valid = false;
      alert('Answer the captcha');
    }

    if (!valid) {
      scrollTop();
    } else {
      const submitButton = document.querySelector('#submit-button');
      submitButton.disabled = true;

      let formData = new FormData(form);

      for (const [key, value] of Object.entries(uploadedImage)) {
        (key === 'valid-id') ? formData.set(key, value) : formData.append(key, value);
      }

      let jsonData = {};
      formData.forEach((value, key) => jsonData[key] = value);

      const response = await fetch('https://script.google.com/macros/s/AKfycbz_5_yYnWy8UdpFyz61AN-EKL6mYg00MlkDNJzRdfC6AXiaN_49zfwJmjfBx7IfNZyw/exec', {
        method: 'POST',
        body: JSON.stringify(jsonData)
      });

      const message = await response.json();

      if (message) {
        form.reset();
        submitButton.disabled = false;
        scrollTop();
        document.querySelector('#documentType').dispatchEvent(new Event('change'));

        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = (message.status === 'success') ?
          'Successfully set an appointment for claiming of document. <br><br>Visit Barangay Pitogo to claim your document and give them your name.' :
          'An error has occured while <br>setting an appointment.<br>Please try again.';

        document.querySelector('body').appendChild(notification);
        setTimeout(() => notification.remove(), 3600);
      }
    }
  });
}

function validateInput() {
  for (const element of form.elements) {
    if (element.type === 'submit' || element.type === 'reset') continue;

    element.addEventListener('change', () => {
      if (element.type === 'file') {
        validateImage(element);

        if (!isInvalid(element)) {
          const image = document.querySelector('#id-picture');
          const reader = new FileReader();
          reader.addEventListener('load', (e) => {
            const name = document.querySelector('#fullname');
            uploadedImage['valid-id-name'] = name.value;
            uploadedImage['valid-id-mime'] = image.files[0].type;
            uploadedImage['valid-id'] = e.target.result.split(',')[1];
          });
          reader.readAsDataURL(image.files[0]);
        }
      } else {
        validateText(element);
      }
    });
  }
}

function setValidity(element, isValid) {
  element.style.border = !isValid ? '2px solid red' : '1px solid rgba(0, 0, 0, 0.4)';
}

function isInvalid(element) {
  return element.style.borderColor === 'red';
}

function validateImage(element) {
  let image = element.files[0];
  if (!(image.type === 'image/png' || image.type === 'image/jpeg' &&
    image.size / 1024 / 1024 <= 5)) setValidity(element, false);
  else setValidity(element, true);
}

function validateText(element) {
  if (!element.value.trim()) setValidity(element, false);
  else setValidity(element, true);
}

function scrollTop() {
  form.addEventListener('reset', e => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    form.elements[0].focus();
  });
}

function documentTypePicker() {
  const documentType = document.querySelector("#documentType");

  documentType.addEventListener('change', e => {
    const form = {
      'cedula': `
          <legend>Cedula Application <span>(Pag-apply ng sedula)</span></legend>
                  <hr>
                  <label for="applicant-name">Applicant Name: <span>(Buong pangalan ng kumukuha)</span></label>
                  <input required type="text" name="applicant-name" id="applicant-name" placeholder="Jose P. Rizal Jr.">
                  <label for="applicant-address">Address: <span>Tirahan</span></label>
                  <input required type="text" name="applicant-address" id="applicant-address"
                      placeholder="123 Cebu St. Barangay Pitogo, Taguig City" >
                  <label for="birthdate">Birthday: <span>(Araw
                      ng kapanganakan)</span></label>
                  <input required type="date" name="applicant-birthday" id="applicant-birthday">
                  <label for="birthplace">Birthplace: <span>(lugar ng kapanganakan)</span></label>
                  <input required type="text" name="applicant-birthplace" id="applicant-birthplace"
                      placeholder="Taguig City, Philippines">
                  <label for="sex">Sex: <span>(Kasarian)</span></label>
                  <select name="sex" id="sex">
                      <option value="Male">Male</option>
                      <hr>
                      <option value="Female"> Female </option>
                  </select>
                  <label for="civil-status">Civil Status: <span>(Pangkalagayang Sibil)</span></label>
                  <select name="applicant-civil-status" id="applicant-civil-status" name="applicant-civil-status">
                      <option value="Single">Single</option>
                      <hr>
                      <option value="Married">Married</option>
                      <hr>
                      <option value="Widowed">Widowed</option>
                      <hr>
                  </select>
                  <label for="Tin">TIN ID NO: <span>(Numero sa iyong TIN)</span></label>
                  <input required type="text" name="TIN-no" id="Tin" placeholder="000-123-456-001 ">
                  <label for="height">Height: <span>(Tangkad)</span></label>
                  <input required type="text" name="applicant-height" id="applicant-height" placeholder="172 cm">
                  <label for="height">Weight: <span>(Bigat)</span></label>
                  <input required type="text" name="applicant-weight" id="applicant-weight" placeholder="70 kg">
                  <label for="occupation">Occupation: <span>(Trabaho)</span></label>
                  <input required type="text" name="applicant-occupation" id="applicant-occupation" placeholder="Guro">
                  <label for="gross-salary">Monthly Gross Salary / Annual Gross: <span>(Buwanang Sweldo/Kabuuang Sweldo sa
                          isang taon)</span></label>
                  <input required type="text" name="applicant-monthly-salary" id="monthly-gross-salary"
                      placeholder="PHP 50,000/PHP 600,000">
                  <label for="daily-income">If (Business) Income in a Day: <span>(Kung negosyo, kita sa isang
                          araw)</span></label>
                  <input required type="text" name="applicant-daily-income" id="daily-income" placeholder="PHP 5,000">
                  <label for="business-name">Name of Business: <span>(Pangalan ng Negosyo)</span></label>
                  <input required type="text" name="applicant-business-name" id="applicant-business-name" placeholder="Sari-sari Store">
                  <label for="purpose">Purpose: <span>(Para saan ang cedula)</span></label>
                  <input required type="text" name="applicant-purpose" id="applicant-purpose" placeholder="Renewal of Business Permit">
          `,

      'barangay-clearance': `
                  <legend>Barangay Clearance/Certificate</legend>
                  <hr>
                  <label for="applicant-name">Applicant Name: <span>(Buong pangalan ng kumukuha)</span></label>
                  <input required type="text" name="applicant-name" id="applicant-name" placeholder="Jose P. Rizal Jr.">
                  <label for="applicant-address">Address: <span>Tirahan</span></label>
                  <input required type="text" name="applicant-address" id="applicant-address"
                      placeholder="123 Cebu St. Barangay Pitogo, Taguig City" >
                  <label for="age"> Age: <span>(Edad)</span></label>
                  <input required type="number" name = "age" id = "age">
                  <label for="birthdate">Birthday: <span>(Araw ng kapanganakan)</span></label>
                  <input required type="date" name="applicant-birthday" id="applicant-birthday">
                  <label for="purpose">Purpose: <span>(Para saan o saan gagamitin ang barangay certificate)</span></label>
                  <textarea name="purpose" id="purpose"></textarea>
                  `,

      'barangay-business-clearance': `
                  <legend>Barangay Business Clearance Permit</legend>
                  <hr>
                  <label for="applicant-name">Applicant Name: <span>(Buong pangalan ng kumukuha)</span></label>
                  <input required type="text" name="applicant-name" id="applicant-name" placeholder="Jose P. Rizal Jr.">
                  <label for="applicant-address">Address: <span>Tirahan</span></label>
                  <input required type="text" name="applicant-address" id="applicant-address" placeholder="123 Cebu St. Barangay Pitogo, Taguig City" >
                  <label for="business-name">Name of Business: <span>(Pangalan ng Negosyo)</span></label>
                  <input required type="text" name="applicant-business-name" id="applicant-business-name" placeholder="Sari-sari Store">
                  <label for="business-capital">Capital of Business: <span>(Kapital ng Negosyo)</span></label>
                  <input required type="text" name="applicant-business-capital" id="applicant-business-name" placeholder="PHP 50,000">
                  <label for="purpose">Purpose: <span>(Para saan o saan gagamitin ang business Clearance)</span></label>
                  <select name="applicant-business-reason" id="business-clearance-reason">
                      <option value="New Business Permit">New Business Permit</option>
                      <option value="Renewal of Business Permit">Renewal of Business Permit</option>
                  </select>               
                  `,

      'barangay-id': `               
                  <legend>Barangay ID</legend>
                  <hr>
                  <label for="applicant-name">Applicant Name: <span>(Buong pangalan ng kumukuha)</span></label>
                  <input required type="text" name="applicant-name" id="applicant-name" placeholder="Jose P. Rizal Jr.">
                  <label for="applicant-address">Address: <span>Tirahan</span></label>
                  <input required type="text" name="applicant-address" id="applicant-address"
                      placeholder="123 Cebu St. Barangay Pitogo, Taguig City" >
                  <label for="birthdate">Birthday: <span>(Araw
                      ng kapanganakan)</span></label>
                  <input required type="date" name="applicant-birthday" id="applicant-birthday">
                  <label for="age"> Age: <span>(Edad)</span></label>
                  <input required type="number" name = "age" id = "age">
                  <label for="applicant-mobile-number">Mobile number:</label>
                  <input required type="number" name="applicant-mobile-number" id="applicant-mobile-number" minlength="11" placeholder="09123456789">
                  <label for="sex">Sex: <span>(Kasarian)</span></label>
                  <select id="sex" name="sex">
                      <option value="Male">Male</option>
                      <hr>
                      <option value="Female"> Female </option>
                  </select>
                  <label for="civil-status">Civil Status: <span>(Pangkalagayang Sibil)</span></label>
                  <select name="applicant-civil-status" id="applicant-civil-status" name="applicant-civil-status">
                      <option value="Single">Single</option>
                      <hr>
                      <option value="Married">Married</option>
                      <hr>
                      <option value="Widowed">Widowed</option>
                      <hr>
                  </select>
                  <br>
                  <br>
                  <legend>Emergency Contact Person <span>(Ipapaalam kung sakaling magkaroon ng Emergency)</span></legend>
                  <hr>
                  <label for="emergency-contact-name">Applicant Name: <span>(Buong pangalan ng kumukuha)</span></label>
                  <input required type="text" name="applicant-contact-name" id="applicant-name" placeholder="Jose P. Rizal Jr.">
                  <label for="emergency-contact-address">Address: <span>Tirahan</span></label>
                  <input required type="text" name="applicant-contact-address" id="applicant-address"
                  placeholder="123 Cebu St. Barangay Pitogo, Taguig City" >
                  <label for="emergency-contact-mobile-number">Mobile number:</label>
                  <input required type="number" name="applicant-contact-mobile-number" id="applicant-mobile-number" minlength="11" placeholder="09123456789">`
    };

    const formAdd = document.querySelector("#form-fields-add");
    formAdd.innerHTML = form[documentType.value];
    validateInput();
  });

  documentType.dispatchEvent(new Event('change'));
}