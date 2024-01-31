function storyboardParse(benchmarkResponse) {
    // Given a benchmark storyboard GPT response, parses it and returned in json-like format.
    // Params:
    // benchmarkResponse (string): benchmark storyboard GPT response in JSON string format
    // Returns:
    // string: json-like string

    // Init lists to populate with the needed values
    let columns = [];
    let subcolumns = [];
    let reference = [];
    let visual = [];
    let audio = [];
    let copy = [];
    let comments = [];

    let benchmarkContent = JSON.parse(benchmarkResponse);

    // Iterate through benchmark to parse the format
    for (let key in benchmarkContent) {
        let value = benchmarkContent[key];
        for (let key_ in value) {
            let value_ = value[key_];
            columns.push({ "name": key_, "spans": Object.keys(value_).length });

            for (let key__ in value_) {
                let value__ = value_[key__];
                subcolumns.push({ "name": key__ });

                reference.push({ "content": value__["image"] });
                visual.push({ "content": value__["image_description"] });
                copy.push({ "content": value__["video_highlight"] });
                audio.push({ "content": value__["audio_copy"] });
                comments.push({ "content": value__["comment"] });
            }
        }
    }

    // Build json-like parsedBenchmark string
    let parsedBenchmark = JSON.stringify({
        "columns": columns,
        "sub_columns": subcolumns,
        "reference": reference,
        "visual": visual,
        "audio": audio,
        "copy": copy,
        "comments": comments
    }, null, 2);

    return JSON.parse(parsedBenchmark);
}

// the following function takes a string of the form "12.asd" and returns "asd"
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function generateStoryboard(gpt_results, show_storyboard) {
    gpt_results = storyboardParse(gpt_results);

    storyboard_html = '<div class="container-3"><div class="section-3 chart"><div class="price-table"><div class="price-table_options"> <div id="price-card-slider" class="swiper cc-price-table"> <div class="swiper-wrapper cc-price-table prueba"> <div class="swiper-slide cc-price-table"> <div name="block" class="price-table_row cc-header"> <div class="price-table_cell cc-header none"></div> ##columns## </div> <div name="subblock" class="price-table_row cc-header"> <div class="price-table_cell cc-header none"></div> ##subcolumns## </div> <div class="price-table_row"> <div class="price-table_cell cc-title reference"><img src="https://assets-global.website-files.com/657080fa4c620ab381ecce5b/6581e08717678c11a51dda15_Group.png" loading="lazy" alt="" class="image-4"> <div class="u-text-semibold"><span class="reference">Reference</span></div> </div> ##reference## </div> <div class="price-table_row"> <div class="price-table_cell cc-title"><img src="https://assets-global.website-files.com/657080fa4c620ab381ecce5b/6581e08717678c11a51dda1b_Group-1.png" loading="lazy" alt="" class="image-4"> <div class="u-text-semibold"><span class="reference">Visual</span></div> </div> ##visual## </div> <div class="price-table_row"> <div class="price-table_cell cc-title"><img src="https://assets-global.website-files.com/657080fa4c620ab381ecce5b/6581e08717678c11a51dda19_Group%20856.png" loading="lazy" alt="" class="image-4"> <div class="u-text-semibold"><span class="reference">Audio</span></div> </div> ##audio## </div> <div class="price-table_row"> <div class="price-table_cell cc-title"><img src="https://assets-global.website-files.com/657080fa4c620ab381ecce5b/6581e08717678c11a51dda15_Group.png" loading="lazy" alt="" class="image-4"> <div class="u-text-semibold"><span class="reference">Copy</span></div> </div> ##copy## </div> <div class="price-table_row"> <div class="price-table_cell cc-title"><img src="https://assets-global.website-files.com/657080fa4c620ab381ecce5b/6581e08717678c11a51dda17_Vector.png" loading="lazy" alt="" class="image-4"> <div class="u-text-semibold"><span class="reference">Comments</span></div> </div> ##comments## </div> </div> </div> </div> </div></div></div></div>'
    column_html = '<div class="price-table_cell cc-callout cc-header subhero" style="width: ##width##;"><div class="u-text-semibold subhero">##content##</div></div>'
    subcolumn_html = '<div class="price-table_cell cc-header"><div class="u-text-semibold">##content##</div></div>'
    reference_html = '<div class="price-table_cell cc-callout"><img src="##src_img##" alt=""></div>'
    visual_html = '<div class="price-table_cell cc-callout"><div class="text-block-3">##content##<br></div></div>'
    audio_html = '<div class="price-table_cell cc-callout"><div class="text-block-3">##content##<br></div></div>'
    copy_html = '<div class="price-table_cell cc-callout"><div class="text-block-3">##content##<br></div></div>'
    comments_html = '<div class="price-table_cell cc-callout"><div class="text-block-3">##content##<br></div></div>'

    all_columns_html = ''
    all_subcolumns_html = ''
    all_reference_html = ''
    all_visual_html = ''
    all_audio_html = ''
    all_copy_html = ''
    all_comments_html = ''
    all_audio_text = ''

    for (var i = 0; i < gpt_results["columns"].length; i++) {
        var column = gpt_results["columns"][i];
        var column_name = column["name"];
        var column_spans = column["spans"];

        var column_html_new = column_html.replaceAll("##content##", getExtension(column_name));
        column_html_new = column_html_new.replaceAll("##width##", (248 * column_spans + 10 * (column_spans - 1)) + "px");
        all_columns_html += column_html_new;
    }

    for (var i = 0; i < gpt_results["sub_columns"].length; i++) {
        var subcolumn = gpt_results["sub_columns"][i];
        var subcolumn_name = subcolumn["name"];

        var subcolumn_html_new = subcolumn_html.replaceAll("##content##", getExtension(subcolumn_name));
        all_subcolumns_html += subcolumn_html_new;

        var reference = gpt_results["reference"][i];
        var reference_content = reference["content"];
        var reference_html_new = reference_html.replaceAll("##content##", reference_content);
        reference_html_new = reference_html_new.replaceAll("##src_img##", IMG_ENDPOINT + reference_content);
        all_reference_html += reference_html_new;

        var visual = gpt_results["visual"][i];
        var visual_content = visual["content"];
        var visual_html_new = visual_html.replaceAll("##content##", visual_content);
        all_visual_html += visual_html_new;

        var audio = gpt_results["audio"][i];
        var audio_content = audio["content"];
        var audio_html_new = audio_html.replaceAll("##content##", audio_content);
        all_audio_html += audio_html_new;
        all_audio_text += audio_content + "<br><br>";

        var copy = gpt_results["copy"][i];
        var copy_content = copy["content"];
        var copy_html_new = copy_html.replaceAll("##content##", copy_content);
        all_copy_html += copy_html_new;

        var comments = gpt_results["comments"][i];
        var comments_content = comments["content"];
        var comments_html_new = comments_html.replaceAll("##content##", comments_content);
        all_comments_html += comments_html_new;
    }

    storyboard_html = storyboard_html.replaceAll("##columns##", all_columns_html);
    storyboard_html = storyboard_html.replaceAll("##subcolumns##", all_subcolumns_html);
    storyboard_html = storyboard_html.replaceAll("##reference##", all_reference_html);
    storyboard_html = storyboard_html.replaceAll("##visual##", all_visual_html);
    storyboard_html = storyboard_html.replaceAll("##audio##", all_audio_html);
    storyboard_html = storyboard_html.replaceAll("##copy##", all_copy_html);
    storyboard_html = storyboard_html.replaceAll("##comments##", all_comments_html);

    $("#txtResults").html("<br><br><br><br><br>" + all_audio_text.replaceAll("%%", "<br><br>"));

    $("#storyboard").html(storyboard_html);

    if (show_storyboard) {
        $("#storyboard").show();
    }
    else {
        $("#storyboard").hide();
    }
}

function calculateButtons(able_to_regenerate, able_to_save_draft, able_to_generate) {
    if (able_to_regenerate) {
        $('#btnGenerate').text("Regenerate");
        $('#btnGenerate').removeClass("hide");
    }
    else {
        $('#btnGenerate').addClass("hide");
    }

    if (able_to_generate) {
        $('#btnGenerate').text("Generate");
        $('#btnGenerate').removeClass("hide");
    }

    if (able_to_save_draft) {
        $('#btnSaveDraft').removeClass("hide");
    }
    else {
        $('#btnSaveDraft').addClass("hide");
    }
}

// add drafts to draftContainer with this html
html_draft = '<label class="w-radio"><input type="radio" data-name="Radio" id="draft_##draft_id##" name="radio" value="Radio" class="w-form-formradioinput w-radio-input draft-item" data-draft="##draft_id##"><span class="radio-text w-form-label" for="radio">Draft ##draft_id##</span></label>'

// add benchmarks to benchmarkContainer with this html
html_benchmark = '<div id="benchmark_##angle_id##_##benchmark_id##" class="accordian-toggle w-dropdown-toggle" id="w-dropdown-toggle-1" aria-controls="w-dropdown-list-1" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0"> <div class="accordian-title-wrapper"> <div class="accordian-title">##benchmark_name##</div> <div class="accordian-icon w-embed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.9998 15L7.75684 10.757L9.17184 9.34302L11.9998 12.172L14.8278 9.34302L16.2428 10.757L11.9998 15Z" fill="currentColor"></path> </svg></div> </div> </div> <nav class="accordian-dropdown w-dropdown-list" style="height: 0px;" id="w-dropdown-list-1" aria-labelledby="w-dropdown-toggle-1"> <div class="accordian-content" style="transform: translate3d(0px, -10px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d; opacity: 0;"> <div class="w-form" id="draftContainer_##angle_id##_##benchmark_id##"> </div> </div> </nav>'

// add angles to angleContainer with this html
html_angle = '<div id="angle_##angle_id##" data-hover="false" data-delay="0" class="dropdown-4 w-dropdown" style="max-width: 940px; display: block"> <div class="dropdown-toggle-3 w-dropdown-toggle" id="w-dropdown-toggle-0" aria-controls="w-dropdown-list-0" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0"> <div class="container-file"><img src="https://assets-global.website-files.com/651484c1d8627ae551b49727/653ad0a5e50fb15f43827452_file-05.svg" loading="lazy" alt="" class="image-3"></div> <div class="container-text--drop"> <div class="icon-dropdown w-icon-dropdown-toggle" aria-hidden="true"></div> <div class="text-block-dropdown" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">##angle_name##</div> </div> </div> <nav class="dropdown-list-3 w-dropdown-list" id="w-dropdown-list-0" aria-labelledby="w-dropdown-toggle-0"> <div class="accordian-wrapper"> <div id="benchmarkContainer_##angle_id##" data-delay="0" data-hover="false" class="accordian-item w-dropdown" style="max-width: 940px;"> </div> </div> </nav> </div>'

var angle_changed = false;

function showOverlay() {
    $("#overlay").show();
}

function hideOverlay() {
    $("#overlay").hide();
}
function getBenchmark(benchmark_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/benchmarks/" + benchmark_id;

    endpoint = formAction
    return $.ajax({
        method: formMethod,
        url: endpoint,
    }).done((res) => {
        return res;
    }
    ).fail((res) => {
        alert(res);
    }
    )
}

function getBenchmarks(ad_id) {
    const formMethod = "GET";
    const formAction = BASE_ENDPOINT + "/ads/" + ad_id + "/benchmarks";

    endpoint = formAction
    $.ajax({
        method: formMethod,
        url: endpoint,
        beforeSend: function () {
            //$('#btnSubmit').val('Please wait...');
        }
    })
        .done((res) => {
            // populate the product selector
            var benchmark_selector = document.getElementById("selBenchmark");
            var benchmarks = res["benchmarks"];
            for (var i = 0; i < benchmarks.length; i++) {
                var opt = document.createElement('option');
                opt.value = benchmarks[i]["id"];
                opt.innerHTML = benchmarks[i]["name"];
                opt.title = benchmarks[i]["description"];
                benchmark_selector.appendChild(opt);

                // if it's the first one, populate the benchmark content
                if (i == 0) {
                    getBenchmark(benchmarks[i]["id"]).then((benchmark_obj) => {
                        var link = benchmark_obj["link"];
                        
                        var benchmark_text = ""

                        for (var i in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"]) {
                            for (var j in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i]) {
                                for (var k in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i][j]) {
                                    benchmark_text += benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i][j][k]["audio_copy"] + "<br><br>";
                                }
                            }
                        }
                        
                        let benchmark_link = "<a href='" + link + "' target='_blank'>[Link]</a><br><br>"
                        $("#txtBenchmarkComparison").html(benchmark_link + (benchmark_text).replaceAll("%%", "<br><br>"));
                        // $("#txtBenchmarkComparison").html((benchmark_obj["hook"] + benchmark_obj["lead_structure"] + benchmark_obj["closing_cta"]).replaceAll("%%", "<br><br>").replaceAll("%%", "<br><br>"));
                    });
                }
            }

            benchmark_selector.addEventListener('change', function () {
                const selectedBenchmarkId = this.value;
                getBenchmark(selectedBenchmarkId).then((benchmark_obj) => {
                    var benchmark_text = ""

                    for (var i in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"]) {
                        for (var j in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i]) {
                            for (var k in benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i][j]) {
                                benchmark_text += benchmark_obj["benchmark_data"]["benchmark_information"]["benchmark_content"][i][j][k]["audio_copy"] + "<br><br>";
                            }
                        }
                    }

                    let benchmark_link = "<a href='" + benchmark_obj["link"] + "' target='_blank'>[Link]</a><br><br>"
                    $("#txtBenchmarkComparison").html(benchmark_link + (benchmark_text).replaceAll("%%", "<br><br>"));
                });
            });

        })
        .fail((res) => {
            alert(res);
        })
}

function addDraft(new_angle_id, new_angle_name, new_benchmark_id, new_benchmark_name, new_draft_id) {
    // check with jquery if the div called angle_(new_angle_id) already exists. if it doesn't append it
    // if it does, don't do anything.
    if ($('#angle_' + new_angle_id).length == 0) {
        // append the new angle
        var html_angle_new = html_angle.replaceAll("##angle_id##", new_angle_id);
        html_angle_new = html_angle_new.replaceAll("##angle_name##", new_angle_name);
        html_angle_new = html_angle_new.replaceAll("##benchmark_id##", new_benchmark_id);
        html_angle_new = html_angle_new.replaceAll("##benchmark_name##", new_benchmark_name);
        $('#angleContainer').append(html_angle_new);
    }


    if ($('#benchmark_' + new_angle_id + '_' + new_benchmark_id).length == 0) {
        // append the new benchmark
        var html_benchmark_new = html_benchmark.replaceAll("##angle_id##", new_angle_id);
        html_benchmark_new = html_benchmark_new.replaceAll("##benchmark_id##", new_benchmark_id);
        html_benchmark_new = html_benchmark_new.replaceAll("##benchmark_name##", new_benchmark_name);
        $('#benchmarkContainer_' + new_angle_id).append(html_benchmark_new);
    }


    if ($('#draft_' + new_draft_id).length == 0) {
        // append the new draft
        var html_draft_new = html_draft.replaceAll("##angle_id##", new_angle_id);
        html_draft_new = html_draft_new.replaceAll("##benchmark_id##", new_benchmark_id);
        html_draft_new = html_draft_new.replaceAll("##draft_id##", new_draft_id);
        $('#draftContainer_' + new_angle_id + '_' + new_benchmark_id).append(html_draft_new);
    }

    Webflow.destroy();
    Webflow.ready();
    Webflow.require('ix2').init();
}
