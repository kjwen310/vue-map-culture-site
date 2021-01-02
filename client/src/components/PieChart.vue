<script>
import { Pie, mixins } from 'vue-chartjs';
import 'chartjs-plugin-labels';

const { reactiveProp } = mixins;

export default {
  mixins: [reactiveProp],
  extends: Pie,
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        plugins: {
          labels: [{
            render: 'label',
            overlap: false,
            fontSize: 16,
            fontColor: '#474747',
          }],
        },
      },
    };
  },
  methods: {
    renderPieChart() {
      this.renderChart(this.chartData, this.options);
    },
  },
  mounted() {
    this.$refs.canvas.height = 250;
    this.$refs.canvas.width = 170;
    this.renderPieChart();
  },
};
</script>

<style lang="scss">
</style>
