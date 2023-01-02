import { registerApplication, start, addErrorHandler, getAppStatus, LOAD_ERROR } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";

import layout from "./views/layout.html";
import loader from "./views/loader.html";

import { publicApiFunction } from '@gfa/gfa-infra';

addErrorHandler(err => {
  if (getAppStatus(err.appOrParcelName) === LOAD_ERROR) {
      System.delete(System.resolve(err.appOrParcelName));
  }

  let el = document.getElementById("single-spa-load-error");

  el.innerHTML = `<div class="spa-err-msg"><div>We're sorry!</div><div>Your request could not be completed at this time. Please try again later.</div></div>`;
  document.title = 'Single-Spa - Error Loading';
  console.log('Error loading app. ', err);
});

window.addEventListener('single-spa:before-app-change', evt => {
  publicApiFunction();
  
  let el = document.getElementById("single-spa-load-error");
  el.innerHTML = '';
});

const data = {
  props: {},
  loaders: {
    loader,
  }
}

const routes = constructRoutes(layout, data);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();
