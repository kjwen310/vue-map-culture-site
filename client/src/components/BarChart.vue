<script>
import { HorizontalBar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  mixins: [reactiveProp],
  extends: HorizontalBar,
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              gridlines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontSize: 12,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    };
  },
  methods: {
    renderBarChart() {
      this.renderChart(this.chartData, this.options);
    },
  },
  mounted() {
    this.$refs.canvas.height = 400;
    this.$refs.canvas.width = 170;
    this.renderBarChart();
  },
};
</script>

<style lang="scss">
</style>
