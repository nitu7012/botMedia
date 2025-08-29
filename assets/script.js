// Checkbox toggle for Step 1
document.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const checkbox = btn.querySelector("input[type=checkbox]");
        checkbox.checked = !checkbox.checked;
        btn.classList.toggle("active", checkbox.checked);
    });
});

let currentStep = 1;
const steps = document.querySelectorAll(".step");
const nextBtn = document.querySelector(".btn-next");
const backBtn = document.querySelector(".btn-back");
const circles = document.querySelectorAll(".step-circle");
const lines = document.querySelectorAll(".line");

function updateProgress(step) {
    circles.forEach((circle, i) => {
        circle.classList.remove("completed", "active");
        if (i < step - 1) {
            circle.classList.add("completed");
            circle.innerHTML = "<i class='fa fa-check'></i>";
        } else if (i === step - 1) {
            circle.classList.add("active");
            circle.innerHTML = i + 1;
        } else {
            circle.innerHTML = i + 1;
        }
    });
    lines.forEach((line, i) => {
        line.classList.toggle("active", i < step - 1);
    });
}

function showStep(step) {
    steps.forEach((s, i) => {
        s.classList.toggle("active", i === step - 1);
    });

    backBtn.style.display = step === 1 ? "none" : "inline-block";
    nextBtn.innerHTML = step === steps.length
        ? "Submit <i class='fa-solid fa-check'></i>"
        : "Next <i class='fa-solid fa-arrow-right'></i>";

    updateProgress(step);
}

function validateStep(step) {
    let valid = true;
    const current = steps[step - 1];
    const inputs = current.querySelectorAll(".required-field");

    // Step 1 special check: at least one checkbox
    if (step === 1) {
        const checked = current.querySelectorAll("input[type=checkbox]:checked").length;
        if (checked === 0) {
            valid = false;
            current.querySelectorAll(".option-btn").forEach(opt => {
                opt.classList.add("is-invalid");
            });
        } else {
            current.querySelectorAll(".option-btn").forEach(opt => {
                opt.classList.remove("is-invalid");
            });
        }
    }

    inputs.forEach(input => {
        const errorText = input.parentElement.querySelector(".error-text");
        if (input.type !== "checkbox") {
            let value = input.value.trim();
            let type = input.dataset.type;

            if (!value) {
                input.classList.add("is-invalid");
                if (errorText) errorText.classList.remove("d-none");
                valid = false;
            } else if (type === "name" && !/^[A-Za-z\s]+$/.test(value)) {
                input.classList.add("is-invalid");
                if (errorText) errorText.classList.remove("d-none");
                valid = false;
            } else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                input.classList.add("is-invalid");
                if (errorText) errorText.classList.remove("d-none");
                valid = false;
            } else if (type === "phone" && !/^\d{10,}$/.test(value)) {
                input.classList.add("is-invalid");
                if (errorText) errorText.classList.remove("d-none");
                valid = false;
            } else {
                input.classList.remove("is-invalid");
                if (errorText) errorText.classList.add("d-none");
            }
        }
    });

    return valid;
}

// Remove red border on focus
document.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("focus", () => {
        el.classList.remove("is-invalid");
        const errorText = el.parentElement.querySelector(".error-text");
        if (errorText) errorText.classList.add("d-none");
    });
});

// Remove red border if checkbox selected
document.querySelectorAll(".option-btn input[type=checkbox]").forEach(chk => {
    chk.addEventListener("change", () => {
        chk.closest(".option-btn").classList.remove("is-invalid");
    });
});

nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length) {
        currentStep++;
        showStep(currentStep);
    } else {
        const modal = bootstrap.Modal.getInstance(document.getElementById('botNModal'));
        modal.hide();
        window.location.href = "thanku.html"; // redirect
    }
});

backBtn.addEventListener("click", () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

showStep(currentStep);