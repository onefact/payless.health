<script setup>
  import { reset } from '@uwdata/vgplot';
  reset();
</script>

# NewYork-Presbyterian Hospital

This demo shows an interactive dashboard of all hospital prices listed at by NewYork-Presbyterian Hospital in New York, NY.

Every mark in the dashboard represents a single procedure, medication, or treatment listed by the hospital; the location of the mark is determined according charges listed by the hospital across health insurance products, or payors.

The more variation there is in the price of care across insurance products, and the more opportunity there is to reduce the price of care. 

# By billing code
<Example spec="/specs/yaml/newyork-presbyterian-sorted-bars.yaml" />

# By billing code category
<Example spec="/specs/yaml/newyork-presbyterian-ticks.yaml" />

[Code to reproduce this analysis](https://colab.research.google.com/github/onefact/data_build_tool_payless.health/blob/main/notebooks/EIN_133957095_newyork-presbyterian-hospital.ipynb) | [Visualization code](https://github.com/onefact/payless.health/blob/main/docs/public/specs/yaml/newyork-presbyterian-sorted-bars.yaml) | [Data Source](https://www.nyp.org/patients-visitors/paying-for-care/hospital-price-transparency/standard-charges) | [Direct data download](https://nyp.widen.net/s/jkfljbb2gq/133957095_newyorkpresbyterianhospital_standardcharges)

Our hope is that publishing such visualizations and datasets that highlight price variation can reduce the financial burden on patients. Such price variation can lead to significant differences in hospital bills and claims.

The input menus and searchbox filter can help you see where there is the most discrepancy between the minimum and maximum charge. This discrepancy is what we help market makers such as large employers aim to reduce, which is a potential key performance indicator for our goal of reducing the price of health care. 

This is an initial prototype demonstrating the technical infrastructure that powers Payless Health, a project in development by the One Fact Foundation, a 501(c)(3) non-profit aiming to reduce the price of health care by building open source AI. 

## How this can help reduce the price of health care

We can help train your team to work with the 4,000+ [hospital price sheets we have collected](https://data.payless.health/#hospital_price_transparency/), for example to analyze health care claim feeds and identify opportunities to improve health outcomes while reducing the cost of care. 

Some of the folks we are lucky to work with have already saved $5-10 million dollars through such analyses, and we'd love to help you do the same. The process usually consists of standardizing a claim feed, linking it to our data, and then using our tools to identify opportunities to reduce the cost of care while improving health outcomes. For example, some folks we work with create incentives for employees such as ride-sharing credits to enable employees to access care at lower cost facilities that are cheaper and higher-quality for procedures that can be planned, such as certain elective surgeries.

## Feedback and collaboration! 

If you have any feedback, want to help build this, or suppport us with a tax-deductible contribution, please join our [chat](https://onefact.zulipchat.com/) or send us an email at [hello@payless.health](mailto:hello@payless.health) :)

We need all the help we can get to reduce the price of health care, and it can start from one fact, such as any one discrepancy between these maximum and minimum negotiated rates published by Lehigh Valley. This demo builds on our first campaign in New York City highlighting the disparity in C section prices: https://www.onefact.org/images/five-boro-bike-tour/payless.health-linknyc-campaign.jpg