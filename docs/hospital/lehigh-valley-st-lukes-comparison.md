<script setup>
  import { reset } from '@uwdata/vgplot';
  reset();
</script>

# Lehigh Valley and St Luke's (Bethlehem) Price Comparison

This demo shows an interactive dashboard of 18 diagnosis-related group codes (DRG codes) and the prices listed at St Luke's (Bethlehem) and Lehigh Valley in PA. **If you click on another page or hospital dashboard, you will need to refresh the page to reload that hospital's data.**

This analysis was conducted by filtering the prices posted by both hospitals first to the top 25 diagnosis-related group codes in California (link [here](https://data.chhs.ca.gov/dataset/top-25-ms-drgs-individual-hospital-pivot-profile); these are largely comparable across states) to the 18 DRG codes that were listed by both hospitals. 

The prices posted by St Luke's can be viewed [here](/hospital/stlukes-bethlehem) and for Lehigh Valley [here](/hospital/lehigh-valley). For Lehigh Valley, only the maximum and minimum inpatient prices were listed by the hospital, denoted by `Maximum_IP` and `Minimum_IP`. We are happy to help these hospitals publish their prices in a more standardized format to comply with the federal price transparency rule; please email us at [hello@payless.health](mailto:hello@payless.health) if you know anyone at either hospital.

<Example spec="/specs/yaml/lehigh-valley-st-lukes-comparison.yaml" />

[Code on GitHub](https://colab.research.google.com/github/onefact/data_build_tool_payless.health/blob/main/notebooks/230901-lehigh-valley-st-lukes-comparison.ipynb) | [Visualization code](https://github.com/onefact/payless.health/blob/main/docs/public/specs/yaml/lehigh-valley-st-lukes-comparison.yaml)

You can select the diagnosis-related group code in the drop-down menu above to see the prices listed by both hospitals to see where there is the most discrepancy between the minimum and maximum charge. This discrepancy is what we help employers reduce to improve access and efficiency to health care.

This is an initial prototype demonstrating the technical infrastructure that powers Payless Health, a project in development by the One Fact Foundation, a 501(c)(3) non-profit aiming to reduce the price of health care by building open source AI. 

## How this can help reduce the price of health care

We can help train your team to work with the 4,000+ [hospital price sheets we have collected](https://data.payless.health/#hospital_price_transparency/), for example to analyze health care claim feeds and identify opportunities to improve health outcomes while reducing the cost of care. 

Some of the folks we are lucky to work with have already saved $5-10 million dollars through such analyses, and we'd love to help you do the same. The process usually consists of standardizing a claim feed, linking it to our data, and then using our tools to identify opportunities to reduce the cost of care while improving health outcomes. For example, some folks we work with create incentives for employees such as ride-sharing credits to enable employees to access care at lower cost facilities that are cheaper and higher-quality for procedures that can be planned, such as certain elective surgeries.

## Feedback and collaboration! 

If you have any feedback, want to help build this, or suppport us with a tax-deductible contribution, please join our [chat](https://onefact.zulipchat.com/) or send us an email at [hello@payless.health](mailto:hello@payless.health) :)

We need all the help we can get to reduce the price of health care, and it can start from one fact, such as any one discrepancy between these maximum and minimum negotiated rates published by Mount Sinai. This demo builds on our first campaign in New York City highlighting the disparity in C section prices: https://www.onefact.org/images/five-boro-bike-tour/payless.health-linknyc-campaign.jpg