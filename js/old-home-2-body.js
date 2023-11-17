var Webflow = Webflow || [];
Webflow.push(function () {

function getBrands() {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/get_brands";

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        beforeSend: function () {
        //$('#btnSubmit').val('Please wait...');
    }
})

    .done((res) => {
    // populate the brand selector
    var brand_selector = document.getElementById("selBrand");
    var brands = res["brands"];
    for (var i = 0; i < brands.length; i++) {
        var opt = document.createElement('option');
        opt.value = brands[i]["brand_id"];
        opt.innerHTML = brands[i]["brand_name"];
        brand_selector.appendChild(opt);
        
        if (i == 0) {
        getProducts(brands[i]["brand_id"]);
        getAudiences(brands[i]["brand_id"]);
        getCountries(brands[i]["brand_id"]);
        }
    }

    })
    .fail((res) => {
    alert(res);
    })
}

function getProducts(brand_id) {

    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/get_products?brand_id=" + brand_id;

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        beforeSend: function () {
        //$('#btnSubmit').val('Please wait...');
    }
})

    .done((res) => {
    $('#selProduct')
        .find('option')
        .remove()
        // populate the product selector
        var product_selector = document.getElementById("selProduct");
        var products = res["products"];
        for (var i = 0; i < products.length; i++) {
            var opt = document.createElement('option');
            opt.value = products[i]["product_id"];
            opt.innerHTML = products[i]["product_name"];
            product_selector.appendChild(opt);
        }

    })
    .fail((res) => {
        alert(res);
    })
}

function getAudiences(brand_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/get_audiences?brand_id=" + brand_id;

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        beforeSend: function () {
        //$('#btnSubmit').val('Please wait...');
    }
    })

    .done((res) => {
        // populate the audience selector
        $('#selAudience')
            .find('option')
            .remove()
        
        var audience_selector = document.getElementById("selAudience");
        var audiences = res["audiences"];
        for (var i = 0; i < audiences.length; i++) {
            var opt = document.createElement('option');
            opt.value = audiences[i]["audience_id"];
            opt.innerHTML = audiences[i]["audience_description"];
            audience_selector.appendChild(opt);
        }

    })
    .fail((res) => {
        alert(res);
    })
}

function getCountries(brand_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/get_countries?brand_id=" + brand_id;

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        beforeSend: function () {
        //$('#btnSubmit').val('Please wait...');
    }
    })

    .done((res) => {
    $('#selCountry')
        .find('option')
        .remove()
        // populate the country selector
        var country_selector = document.getElementById("selCountry");
        var countries = res["countries"];
        for (var i = 0; i < countries.length; i++) {
            var opt = document.createElement('option');
            opt.value = countries[i]["country_id"];
            opt.innerHTML = countries[i]["country_name"];
            country_selector.appendChild(opt);
        }

    })
    .fail((res) => {
        alert(res);
    })
}

  // unbind webflow form handling (keep this if you only want to affect specific forms)
  //$(document).off('submit');
$('#selBrand').change(function(e) {
    var brand_id = $(this).val();
    
    getProducts(brand_id);
    getAudiences(brand_id);
    getCountries(brand_id);
});

  /* Any form on the page */
$('#btnCreateProject').click(function (e) {
    e.preventDefault();

    const formMethod = "POST";
    const formAction = BASE_ENDPOINT + "/create_project";

    var product_selector = document.getElementById("selProduct");
    var audience_selector = document.getElementById("selAudience");
    var country_selector = document.getElementById("selCountry");
    var brand_selector = document.getElementById("selBrand");

    var product_id = product_selector.options[product_selector.selectedIndex].value;
    var audience_id = audience_selector.options[audience_selector.selectedIndex].value;
    var country_id = country_selector.options[country_selector.selectedIndex].value;
    var brand_id = brand_selector.options[brand_selector.selectedIndex].value;

    var project_name = document.getElementById("txtProjectName").value;
    var angle = document.getElementById("txtBigIdea").value;
    
    // check if radio button radLanding is checked
    var landing = document.getElementById("radLanding");
    var landing_page = false;
    if (landing.checked == true) {
        landing_page = true;
    }

    var lead_ad = document.getElementById("radLeadAd");
    var lead_ad_check = false;
    if (lead_ad.checked == true) {
        lead_ad_check = true;
    }

    var short_ad = document.getElementById("radShortAd");
    var short_ad_check = false;
    if (short_ad.checked == true) {
        short_ad_check = true;
    }

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        data: JSON.stringify(
        {
            project_name: project_name,
            audience_id: audience_id,
            product_id: product_id,
            angle: angle,
            project_name: project_name,
            landing_page: landing_page,
            lead_ad: lead_ad_check,
            short_ad: short_ad_check,
        }),
        beforeSend: function () {
        //$('#btnSubmit').val('Please wait...');
        }
    })

    .done((res) => {
        project_id = res["project_id"]
        angle_id = res["angle_id"]
        ad_id = res["ad_id"]

        // redirect to https://altair-trafilea.webflow.io/project-page with the project id
        window.location.href = "https://api-integration-test-e340db.webflow.io/project-page?project_id=" + project_id + "&angle_id=" + angle_id + "&ad_id=" + ad_id;

    })
    .fail((res) => {
        alert(res);
    })

});

// call a function that retrieves data from the BASE_ENDPOINT/get_brands endpoint
// and populates the brand selector
getBrands();
});
