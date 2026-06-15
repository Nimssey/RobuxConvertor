const rates = {
	"0.0038": {
		label: "Standard Rate",
		description: "Standard Rate: $0.0038 per Robux, equal to $38 per 10,000 Robux."
	},
	"0.0054": {
		label: "18+ US Player Rate",
		description: "18+ US Player Rate: $0.0054 per Robux, equal to $54 per 10,000 Robux."
	},
	"0.0035": {
		label: "Legacy/manual Rate",
		description: "Legacy/manual Rate: $0.0035 per Robux, equal to $35 per 10,000 Robux."
	}
};

const robuxInput = document.getElementById("robuxInput");
const valueOutput = document.getElementById("valueOutput");
const currencySelect = document.getElementById("currencySelect");
const currencyUnit = document.getElementById("currencyUnit");
const rateSelect = document.getElementById("rateSelect");
const eurRateControl = document.getElementById("eurRateControl");
const eurRateStatus = document.getElementById("eurRateStatus");
const rateDescription = document.getElementById("rateDescription");
const EUR_RATE_API = "https://api.frankfurter.dev/v2/rate/USD/EUR";
const EUR_RATE_FALLBACK = 0.92;
let usdToEurRate = EUR_RATE_FALLBACK;
let usdToEurSynced = false;

const formatters = {
	USD: new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2
	}),
	EUR: new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 2
	})
};
const robuxFormatter = new Intl.NumberFormat("de-DE", {
	maximumFractionDigits: 0
});

function parseRobux(value) {
	const normalized = value.replace(/\D/g, "");
	const number = Number(normalized);

	if (!Number.isFinite(number)) {
		return 0;
	}

	return Math.max(Math.floor(number), 0);
}

function formatRobuxInput() {
	const robux = parseRobux(robuxInput.value);

	if (robux <= 0) {
		robuxInput.value = "";
		return 0;
	}

	robuxInput.value = robuxFormatter.format(robux);
	return robux;
}

function updateDescription(currency, rate) {
	const rateInfo = rates[String(rate)];
	const baseDescription = rateInfo ? rateInfo.description : "";

	if (currency === "EUR") {
		rateDescription.textContent = `${baseDescription} EUR uses the latest USD to EUR rate synced from Frankfurter.`;
		return;
	}

	rateDescription.textContent = baseDescription;
}

function updateEurRateStatus() {
	const formattedRate = usdToEurRate.toFixed(4);
	const label = usdToEurSynced ? "Live rate" : "Fallback rate";

	eurRateStatus.textContent = `${label}: 1 USD = ${formattedRate} EUR`;
}

function convert() {
	const robux = parseRobux(robuxInput.value);
	const currency = currencySelect.value;
	const rate = Number(rateSelect.value);
	const usdValue = robux * rate;
	const finalValue = currency === "EUR" ? usdValue * usdToEurRate : usdValue;

	valueOutput.value = formatters[currency].format(finalValue);
	currencyUnit.textContent = currency;
	eurRateControl.classList.toggle("hidden", currency !== "EUR");
	updateEurRateStatus();
	updateDescription(currency, rate);
}

async function syncUsdToEurRate() {
	try {
		const response = await fetch(EUR_RATE_API, {
			cache: "no-store"
		});

		if (!response.ok) {
			throw new Error("Rate request failed");
		}

		const data = await response.json();
		const rate = Number(data.rate);

		if (!Number.isFinite(rate) || rate <= 0) {
			throw new Error("Invalid rate");
		}

		usdToEurRate = rate;
		usdToEurSynced = true;
	} catch (_error) {
		usdToEurRate = EUR_RATE_FALLBACK;
		usdToEurSynced = false;
	}

	convert();
}

robuxInput.addEventListener("input", function() {
	formatRobuxInput();
	convert();
});
currencySelect.addEventListener("change", convert);
rateSelect.addEventListener("change", convert);

convert();
syncUsdToEurRate();
