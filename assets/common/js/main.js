/* HABILITANDOI TOOLTIPS */
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
/* HABILITANDOI TOOLTIPS */

function stringToAnchor(string)
{
    const anchor = document.createElement("a");
    anchor.href = string;
    return anchor;
}