// Create a Stripe client.
// add your PK_test key here
// https://stripe.com/docs/keys
var STRIPE_PUBLISHABLE_KEY = "pk_test_12345";

// Change the host url to match where you host the server
var HOST_URL = "";

function browserLocale() {
  var lang;

  if (navigator.languages && navigator.languages.length) {
    // latest versions of Chrome and Firefox set this correctly
    lang = navigator.languages[0];
  } else if (navigator.userLanguage) {
    // IE only
    lang = navigator.userLanguage;
  } else {
    // latest versions of Chrome, Firefox, and Safari set this correctly
    lang = navigator.language;
  }

  return lang;
}

function zeroDecimalCurrencies(currency) {
  var zeroDecimalCurrencies = [
    "BIF",
    "CLP",
    "DJF",
    "GNF",
    "JPY",
    "KMF",
    "KRW",
    "XPF",
    "XOF",
    "XAF",
    "VUV",
    "VND",
    "UGX",
    "RWF",
    "PYG",
    "MGA"
  ];
  return zeroDecimalCurrencies.indexOf(currency);
}

function calculateDisplayAmountFromCurrency(paymentIntent) {
  var amountToDisplay = paymentIntent.amount;

  if (zeroDecimalCurrencies(paymentIntent.currency) === -1) {
    amountToDisplay = amountToDisplay / 100;
  }
  return amountToDisplay.toLocaleString(browserLocale(), {
    style: "currency",
    currency: paymentIntent.currency
  });
}

function init(content, paymentIntent, publicKey) {
  var amount = calculateDisplayAmountFromCurrency(paymentIntent);
  var modal = document.createElement("div");
  modal.className = "ElementsModal--modal";
  modal.innerHTML = `
  <div class="ElementsModal--modal-content">
  <div class="ElementsModal--top-banner">
    <div class="ElementsModal--sales-info">
      <div class="ElementsModal--top">
        <div class="ElementsModal--company">${content.businessName || ""}</div>
        <button class="ElementsModal--close" onClick="window.elementsModal.toggleElementsModalVisibility()">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <path
                d="M10,8.8766862 L13.6440403,5.2326459 C13.9542348,4.92245137 14.4571596,4.92245137 14.7673541,5.2326459 C15.0775486,5.54284044 15.0775486,6.04576516 14.7673541,6.3559597 L11.1238333,9.99948051 L14.7673541,13.6430016 C15.0775486,13.9531961 15.0775486,14.4561209 14.7673541,14.7663154 C14.4571596,15.0765099 13.9542348,15.0765099 13.6440403,14.7663154 L10,11.1222751 L6.3559597,14.7663154 C6.04576516,15.0765099 5.54284044,15.0765099 5.2326459,14.7663154 C4.92245137,14.4561209 4.92245137,13.9531961 5.2326459,13.6430016 L8.87616671,9.99948051 L5.2326459,6.3559597 C4.92245137,6.04576516 4.92245137,5.54284044 5.2326459,5.2326459 C5.54284044,4.92245137 6.04576516,4.92245137 6.3559597,5.2326459 L10,8.8766862 Z"
                id="path-1"
              ></path>
            </defs>
            <g
              id="Payment-recipes"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Elements-Popup"
                transform="translate(-816.000000, -97.000000)"
              >
                <g id="close-btn" transform="translate(816.000000, 97.000000)">
                  <circle
                    id="Oval"
                    fill-opacity="0.3"
                    fill="#AEAEAE"
                    cx="10"
                    cy="10"
                    r="10"
                  ></circle>
                  <mask id="mask-2" fill="white">
                    <use xlink:href="#path-1"></use>
                  </mask>
                  <use
                    id="Mask"
                    fill-opacity="0.5"
                    fill="#FFFFFF"
                    opacity="0.5"
                    xlink:href="#path-1"
                  ></use>
                </g>
              </g>
            </g>
          </svg>
        </button>
      </div>
      <div class="ElementsModal--product ElementsModal--details">${content.productName ||
        ""}</div>
      <div class="ElementsModal--price ElementsModal--details">${amount}</div>
      <div class="ElementsModal--email ElementsModal--details">${content.customerEmail ||
        ""}</div>
    </div>
  </div>
  <div class="ElementsModal--payment-details">
    <form
      class="ElementsModal--payment-form"
      id="payment-form"
    >
      <div class="form-row">
        <div class="ElementsModal--forms">
          <div class="ElementsModal--form">
            <label for="ElementsModal--card-element">
              <span class="ElementsModal--form-label spacer"
                >Card details</span
              >
              <div class="StripeElement" id="card-element">
                <!-- A Stripe Element will be inserted here. -->
              </div>
            </label>
            <!-- Used to display form errors. -->
            <div
              id="card-errors"
              class="ElementsModal--error-message"
              role="alert"
            ></div>
          </div>

          <div class="ElementsModal--form">
            <label class="select">
              <span class="ElementsModal--form-label spacer"
                >Country or region</span
              >
              <div id="country" class="ElementsModal--form-select">
                <select name="country" autocomplete="billing country" aria-label="Country or region">
                <option value="AF">Afghanistan</option
                ><option value="AX">Åland Islands</option
                ><option value="AL">Albania</option
                ><option value="DZ">Algeria</option
                ><option value="AD">Andorra</option
                ><option value="AO">Angola</option
                ><option value="AI">Anguilla</option
                ><option value="AQ">Antarctica</option
                ><option value="AG">Antigua &amp; Barbuda</option
                ><option value="AR">Argentina</option
                ><option value="AM">Armenia</option
                ><option value="AW">Aruba</option
                ><option value="AC">Ascension Island</option
                ><option value="AU">Australia</option
                ><option value="AT">Austria</option
                ><option value="AZ">Azerbaijan</option
                ><option value="BS">Bahamas</option
                ><option value="BH">Bahrain</option
                ><option value="BD">Bangladesh</option
                ><option value="BB">Barbados</option
                ><option value="BY">Belarus</option
                ><option value="BE">Belgium</option
                ><option value="BZ">Belize</option
                ><option value="BJ">Benin</option
                ><option value="BM">Bermuda</option
                ><option value="BT">Bhutan</option
                ><option value="BO">Bolivia</option
                ><option value="BA">Bosnia &amp; Herzegovina</option
                ><option value="BW">Botswana</option
                ><option value="BV">Bouvet Island</option
                ><option value="BR">Brazil</option
                ><option value="IO">British Indian Ocean Territory</option
                ><option value="VG">British Virgin Islands</option
                ><option value="BN">Brunei</option
                ><option value="BG">Bulgaria</option
                ><option value="BF">Burkina Faso</option
                ><option value="BI">Burundi</option
                ><option value="KH">Cambodia</option
                ><option value="CM">Cameroon</option
                ><option value="CA">Canada</option
                ><option value="CV">Cape Verde</option
                ><option value="BQ">Caribbean Netherlands</option
                ><option value="KY">Cayman Islands</option
                ><option value="CF">Central African Republic</option
                ><option value="TD">Chad</option
                ><option value="CL">Chile</option
                ><option value="CN">China</option
                ><option value="CO">Colombia</option
                ><option value="KM">Comoros</option
                ><option value="CG">Congo - Brazzaville</option
                ><option value="CD">Congo - Kinshasa</option
                ><option value="CK">Cook Islands</option
                ><option value="CR">Costa Rica</option
                ><option value="CI">Côte d’Ivoire</option
                ><option value="HR">Croatia</option
                ><option value="CW">Curaçao</option
                ><option value="CY">Cyprus</option
                ><option value="CZ">Czechia</option
                ><option value="DK">Denmark</option
                ><option value="DJ">Djibouti</option
                ><option value="DM">Dominica</option
                ><option value="DO">Dominican Republic</option
                ><option value="EC">Ecuador</option
                ><option value="EG">Egypt</option
                ><option value="SV">El Salvador</option
                ><option value="GQ">Equatorial Guinea</option
                ><option value="ER">Eritrea</option
                ><option value="EE">Estonia</option
                ><option value="ET">Ethiopia</option
                ><option value="FK">Falkland Islands</option
                ><option value="FO">Faroe Islands</option
                ><option value="FJ">Fiji</option
                ><option value="FI">Finland</option
                ><option value="FR">France</option
                ><option value="GF">French Guiana</option
                ><option value="PF">French Polynesia</option
                ><option value="TF">French Southern Territories</option
                ><option value="GA">Gabon</option
                ><option value="GM">Gambia</option
                ><option value="GE">Georgia</option
                ><option value="DE">Germany</option
                ><option value="GH">Ghana</option
                ><option value="GI">Gibraltar</option
                ><option value="GR">Greece</option
                ><option value="GL">Greenland</option
                ><option value="GD">Grenada</option
                ><option value="GP">Guadeloupe</option
                ><option value="GU">Guam</option
                ><option value="GT">Guatemala</option
                ><option value="GG">Guernsey</option
                ><option value="GN">Guinea</option
                ><option value="GW">Guinea-Bissau</option
                ><option value="GY">Guyana</option
                ><option value="HT">Haiti</option
                ><option value="HN">Honduras</option
                ><option value="HK">Hong Kong SAR China</option
                ><option value="HU">Hungary</option
                ><option value="IS">Iceland</option
                ><option value="IN">India</option
                ><option value="ID">Indonesia</option
                ><option value="IR">Iran</option
                ><option value="IQ">Iraq</option
                ><option value="IE">Ireland</option
                ><option value="IM">Isle of Man</option
                ><option value="IL">Israel</option
                ><option value="IT">Italy</option
                ><option value="JM">Jamaica</option
                ><option value="JP">Japan</option
                ><option value="JE">Jersey</option
                ><option value="JO">Jordan</option
                ><option value="KZ">Kazakhstan</option
                ><option value="KE">Kenya</option
                ><option value="KI">Kiribati</option
                ><option value="XK">Kosovo</option
                ><option value="KW">Kuwait</option
                ><option value="KG">Kyrgyzstan</option
                ><option value="LA">Laos</option
                ><option value="LV">Latvia</option
                ><option value="LB">Lebanon</option
                ><option value="LS">Lesotho</option
                ><option value="LR">Liberia</option
                ><option value="LY">Libya</option
                ><option value="LI">Liechtenstein</option
                ><option value="LT">Lithuania</option
                ><option value="LU">Luxembourg</option
                ><option value="MO">Macau SAR China</option
                ><option value="MK">Macedonia</option
                ><option value="MG">Madagascar</option
                ><option value="MW">Malawi</option
                ><option value="MY">Malaysia</option
                ><option value="MV">Maldives</option
                ><option value="ML">Mali</option
                ><option value="MT">Malta</option
                ><option value="MQ">Martinique</option
                ><option value="MR">Mauritania</option
                ><option value="MU">Mauritius</option
                ><option value="YT">Mayotte</option
                ><option value="MX">Mexico</option
                ><option value="MD">Moldova</option
                ><option value="MC">Monaco</option
                ><option value="MN">Mongolia</option
                ><option value="ME">Montenegro</option
                ><option value="MS">Montserrat</option
                ><option value="MA">Morocco</option
                ><option value="MZ">Mozambique</option
                ><option value="MM">Myanmar (Burma)</option
                ><option value="NA">Namibia</option
                ><option value="NR">Nauru</option
                ><option value="NP">Nepal</option
                ><option value="NL">Netherlands</option
                ><option value="NC">New Caledonia</option
                ><option value="NZ">New Zealand</option
                ><option value="NI">Nicaragua</option
                ><option value="NE">Niger</option
                ><option value="NG">Nigeria</option
                ><option value="NU">Niue</option
                ><option value="NO">Norway</option
                ><option value="OM">Oman</option
                ><option value="PK">Pakistan</option
                ><option value="PS">Palestinian Territories</option
                ><option value="PA">Panama</option
                ><option value="PG">Papua New Guinea</option
                ><option value="PY">Paraguay</option
                ><option value="PE">Peru</option
                ><option value="PH">Philippines</option
                ><option value="PN">Pitcairn Islands</option
                ><option value="PL">Poland</option
                ><option value="PT">Portugal</option
                ><option value="PR">Puerto Rico</option
                ><option value="QA">Qatar</option
                ><option value="RE">Réunion</option
                ><option value="RO">Romania</option
                ><option value="RU">Russia</option
                ><option value="RW">Rwanda</option
                ><option value="WS">Samoa</option
                ><option value="SM">San Marino</option
                ><option value="ST">São Tomé &amp; Príncipe</option
                ><option value="SA">Saudi Arabia</option
                ><option value="SN">Senegal</option
                ><option value="RS">Serbia</option
                ><option value="SC">Seychelles</option
                ><option value="SL">Sierra Leone</option
                ><option value="SG">Singapore</option
                ><option value="SX">Sint Maarten</option
                ><option value="SK">Slovakia</option
                ><option value="SI">Slovenia</option
                ><option value="SB">Solomon Islands</option
                ><option value="SO">Somalia</option
                ><option value="ZA">South Africa</option
                ><option value="GS">South Georgia &amp; South Sandwich Islands</option
                ><option value="KR">South Korea</option
                ><option value="SS">South Sudan</option
                ><option value="ES">Spain</option
                ><option value="LK">Sri Lanka</option
                ><option value="BL">St. Barthélemy</option
                ><option value="SH">St. Helena</option
                ><option value="KN">St. Kitts &amp; Nevis</option
                ><option value="LC">St. Lucia</option
                ><option value="MF">St. Martin</option
                ><option value="PM">St. Pierre &amp; Miquelon</option
                ><option value="VC">St. Vincent &amp; Grenadines</option
                ><option value="SR">Suriname</option
                ><option value="SJ">Svalbard &amp; Jan Mayen</option
                ><option value="SZ">Swaziland</option
                ><option value="SE">Sweden</option
                ><option value="CH">Switzerland</option
                ><option value="TW">Taiwan</option
                ><option value="TJ">Tajikistan</option
                ><option value="TZ">Tanzania</option
                ><option value="TH">Thailand</option
                ><option value="TL">Timor-Leste</option
                ><option value="TG">Togo</option
                ><option value="TK">Tokelau</option
                ><option value="TO">Tonga</option
                ><option value="TT">Trinidad &amp; Tobago</option
                ><option value="TA">Tristan da Cunha</option
                ><option value="TN">Tunisia</option
                ><option value="TR">Turkey</option
                ><option value="TM">Turkmenistan</option
                ><option value="TC">Turks &amp; Caicos Islands</option
                ><option value="TV">Tuvalu</option
                ><option value="UG">Uganda</option
                ><option value="UA">Ukraine</option
                ><option value="AE">United Arab Emirates</option
                ><option value="GB">United Kingdom</option
                ><option value="US" selected="selected">United States</option
                ><option value="UY">Uruguay</option
                ><option value="UZ">Uzbekistan</option
                ><option value="VU">Vanuatu</option
                ><option value="VA">Vatican City</option
                ><option value="VE">Venezuela</option
                ><option value="VN">Vietnam</option
                ><option value="WF">Wallis &amp; Futuna</option
                ><option value="EH">Western Sahara</option
                ><option value="YE">Yemen</option
                ><option value="ZM">Zambia</option
                ><option value="ZW">Zimbabwe</option>
                </select>
              </div>
            </label>
          </div>

          <div class="ElementsModal--form">
            <input
              type="hidden"
              name="amount"
              value="${amount}"
            />
            <input
              type="hidden"
              name="currency"
              value="${content.currency}"
            />
            <input
              type="hidden"
              name="description"
              value="${content.productName}"
            />
            <button class="ElementsModal--pay-button">Pay ${amount}</button>
          </div>

          <!-- Edit your terms and conditions here   -->
          <div class="footer ElementsModal--footer-text">
            By purchasing this chair, you agree to KAVHOLM’s
            <a class="ElementsModal--footer-text" href="stripe.com"
              >Terms and Conditions.</a
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
`;
  // insert modal in dom
  document.body.insertBefore(modal, document.body.firstChild);
  createElements(content, paymentIntent, publicKey);
}

function toggleElementsModalVisibility() {
  var modal = document.querySelector(".ElementsModal--modal");
  modal.classList.toggle("ElementsModal--show-modal");
}

function createPaymentIntent(content) {
  return fetch(HOST_URL + "/payment_intents", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(content)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(paymentIntent) {
      return paymentIntent;
    });
}

function getPublicKey() {
  return fetch(HOST_URL + "/public-key", {
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(stripePublicKey) {
      return stripePublicKey.publicKey;
    });
}

function create(content) {
  Promise.all([createPaymentIntent(content), getPublicKey()]).then(function(
    result
  ) {
    var [paymentIntent, publicKey] = result;
    init(content, paymentIntent, publicKey);
  });

  // UI enhancement to dismiss the Elements modal when the user clicks
  // outside of the modal and in the window.
  function dismissElementsModalOnWindowClick(event) {
    var modal = document.querySelector(".ElementsModal--modal");
    if (
      event.target === modal &&
      modal.classList[1] === "ElementsModal--show-modal"
    ) {
      toggleElementsModalVisibility();
    }
  }
  window.addEventListener("click", dismissElementsModalOnWindowClick);

  // Allows the user to dismiss the Elements modal when using the esc key
  document.addEventListener("keyup", function(event) {
    if (event.defaultPrevented) {
      return;
    }

    var key = event.key || event.keyCode;

    if (key === "Escape" || key === "Esc" || key === 27) {
      var modal = document.querySelector(".ElementsModal--modal");
      if (modal.classList[1] === "ElementsModal--show-modal") {
        toggleElementsModalVisibility();
      }
    }
  });
}

function createElements(content, paymentIntent, publicKey) {
  var stripe = Stripe(publicKey);

  // Create an instance of Elements.
  var elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  // (Note that this  uses a wider set of styles than the guide below.)
  var style = {
    base: {
      color: "#32325d",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  // Create an instance of the card Element.
  var card = elements.create("card", {
    style: style
  });
  // Add an instance of the card Element into the `card-element` <div>.
  card.mount("#card-element");

  // Handle payment submission when user clicks the pay button.
  var form = document.getElementById("payment-form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    stripe
      .confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: card,
          billing_details: { name: content.customerName }
        }
      })
      .then(function(result) {
        if (result.error) {
          var displayError = document.getElementById("card-errors");
          displayError.textContent = result.error.message;
        } else {
          stripePaymentHandler();
        }
      });
  });
}

// Implement logic to handle the users authorization for payment.
// Here you will want to redirect to a successful payments page, or update the page.
function stripePaymentHandler() {
  toggleElementsModalVisibility();
  document.getElementById("endstate").style.display = "block";
  document.getElementById("startstate").style.display = "none";
}

window.elementsModal = (() => {
  return { create, toggleElementsModalVisibility };
})();
