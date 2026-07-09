"use strict";

document.addEventListener("DOMContentLoaded", function () {

    var animatedElements = document.querySelectorAll(".animate-on-scroll");

    var showElement = function (element) {
        element.classList.add("visible");
    };
    if (!("IntersectionObserver" in window)) {
        animatedElements.forEach(function (element) {
            showElement(element);
        });
    }
    else {
        var observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.15
        };

        var scrollObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    showElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function (element) {
            scrollObserver.observe(element);
        });
    }
    var DEFAULT_CQC_REPORT_LINK = "https://www.cqc.org.uk/location/1-21880781607";

    var cqcReportButton = document.querySelector(".cqc-action .btn-secondary");

    if (cqcReportButton) {
        cqcReportButton.setAttribute("href", DEFAULT_CQC_REPORT_LINK);
        cqcReportButton.setAttribute("aria-label", "Read Park Grove's full CQC inspection report");

        cqcReportButton.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = DEFAULT_CQC_REPORT_LINK;
        });
    }
});