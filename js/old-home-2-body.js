var Webflow = Webflow || [];
Webflow.push(function () {

function getBrands() {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/brands";

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
        opt.value = brands[i]["id"];
        opt.innerHTML = brands[i]["name"];
        brand_selector.appendChild(opt);
        
        if (i == 0) {
        getProducts(brands[i]["id"]);
        getAudiences(brands[i]["id"]);
        getCountries(brands[i]["id"]);
        }
    }

    })
    .fail((res) => {
    alert(res);
    })
}

function getProducts(brand_id) {

    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/brands/" + brand_id + "/products";

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
            opt.value = products[i]["id"];
            opt.innerHTML = products[i]["name"];
            product_selector.appendChild(opt);
        }

    })
    .fail((res) => {
        alert(res);
    })
}

function getAudiences(brand_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/brands/" + brand_id + "/audiences";

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
            opt.value = audiences[i]["id"];
            opt.innerHTML = audiences[i]["description"];
            audience_selector.appendChild(opt);
        }

    })
    .fail((res) => {
        alert(res);
    })
}

function getCountries(brand_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/brands/" + brand_id + "/countries";

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
            opt.value = countries[i]["id"];
            opt.innerHTML = countries[i]["name"];
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
    const formAction = BASE_ENDPOINT + "/projects";

    var email = ""
    if (member) {
        email = member.email;
    }

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
    var ad_id = 0;
    if (landing.checked == true) {
        ad_id = 3;
    }

    var lead_ad = document.getElementById("radLeadAd");
    if (lead_ad.checked == true) {
        ad_id = 1;
    }

    var short_ad = document.getElementById("radShortAd");
    if (short_ad.checked == true) {
        ad_id = 2;
    }

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(
        {
            name: project_name,
            audience_id: parseInt(audience_id),
            product_id: parseInt(product_id),
            angle: angle,
            ad_id: parseInt(ad_id),
            user_id: 1,
            country_id: parseInt(country_id),
            email: email,
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
        window.location.href = CURRENT_DOMAIN + "/members/project-page?project_id=" + project_id + "&angle_id=" + angle_id + "&ad_id=" + ad_id;

    })
    .fail((res) => {
        alert(res);
    })

});

// call a function that retrieves data from the BASE_ENDPOINT/get_brands endpoint
// and populates the brand selector
getBrands();
});
