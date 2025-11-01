import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectCount = projects.length;
const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `Projects (${projectCount})`;

let selectedIndex = -1; // no index
let selectedYear = -1 // no year

function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // re-calculate data
  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  // re-calculate slice generator, arc data, arc, etc.
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arcs = arcData.map((d) => arcGenerator(d));

  // clear up paths and legends
  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');
  svg.selectAll('*').remove();
  legend.selectAll('*').remove();

  // update paths and legends
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // draw arcs
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        // toggle selection
        selectedIndex = selectedIndex === i ? -1 : i;
        selectedYear = selectedIndex === -1 ? null : data[selectedIndex].label;

        // update all paths
        svg.selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        // update all legend items
        legend.selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));

        // filter
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
        } else {
          const year = data[selectedIndex].label;
          const filtered = projectsGiven.filter(p => String(p.year) === String(year));
          renderProjects(filtered, projectsContainer, 'h2');
        }

      });
  });

  // draw legend
  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        // toggle selection
        selectedIndex = selectedIndex === idx ? -1 : idx;
        selectedYear = selectedIndex === -1 ? null : data[selectedIndex].label;

        // update paths
        svg.selectAll('path')
          .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));

        // update legends
        legend.selectAll('li')
          .attr('class', (_, i) => (i === selectedIndex ? 'legend-item selected' : 'legend-item'));
      });
  });
}

// Call this function on page load
renderPieChart(projects);

// search features
let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  let filteredProjects = projects.filter((project) => {
    query = event.target.value;
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  if(selectedYear !== null) {
      filteredProjects = filteredProjects.filter((p) => String(p.year) === String(selectedYear));
  }

  // re-render legends and pie chart when event triggers
  projectsContainer.innerHTML = '';
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
