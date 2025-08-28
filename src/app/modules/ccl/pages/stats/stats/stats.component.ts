import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  // Camembert (Pie)
  pieChartData: ChartData<'pie'> = {
    labels: ['Chrome', 'Firefox', 'Edge', 'Safari'],
    datasets: [{
      data: [55, 25, 15, 5],
      backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0']
    }]
  };

  // Barres
  barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Ventes',
      data: [120, 150, 180, 90, 200],
      backgroundColor: '#42A5F5'
    }]
  };

  // Courbe (Line)
  lineChartData: ChartData<'line'> = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    datasets: [{
      label: 'Trafic',
      data: [30, 45, 60, 40],
      fill: false,
      borderColor: '#FF5722',
      tension: 0.4
    }]
  };

  // Pourcentage de tâches (Doughnut)
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Complétées', 'En cours', 'Restantes'],
    datasets: [{
      data: [65, 20, 15],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  // Graph Radar
  radarChartData: ChartData<'radar'> = {
    labels: ['Vitesse', 'Qualité', 'Innovation', 'Satisfaction'],
    datasets: [{
      label: 'Performance',
      data: [80, 90, 70, 85],
      borderColor: '#673AB7',
      backgroundColor: 'rgba(103, 58, 183, 0.2)'
    }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };
}
