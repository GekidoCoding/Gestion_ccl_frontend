import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Agent } from '../../model/agent/agent';
import { Direction } from '../../model/direction/direction';
import { DrhService } from '../../model/drh-service/drh-service';
import { AgentService } from '../../services/agent/agent.service';
import { DirectionService } from '../../services/direction/direction.service';
import { DrhServiceService } from '../../services/drh-service/drh-service.service';
import { GestionnaireService } from '../../services/gestionnaire/gestionnaire.service';
import { Gestionnaire } from '../../model/gestionnaire/gestionnaire';
import { Page } from '../../interface/page.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-gestionnaire-add',
  templateUrl: './gestionnaire-add.component.html',
  styleUrls: ['./gestionnaire-add.component.scss']
})
export class GestionnaireAddComponent implements OnInit {
  numbers: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  agents: Agent[] = [];
  directions: Direction[] = [];
  filteredDirections: Direction[] = [];
  services: DrhService[] = [];
  filteredServices: DrhService[] = [];
  criteriaAgent: Agent = new Agent();
  isLoading: boolean = false;
  agentAdd: Agent = new Agent();
  showConfirmationAgent: boolean = false;
  currentPage = 0; // 0-based indexing for API
  itemsPerPage = 10;
  totalPages = 1; // Provided by API
  totalItems = 0; // Provided by API (totalElements)
  pageNumbers: number[] = [];
  serviceCtrl = new FormControl('');
  directionCtrl = new FormControl('');

  constructor(
      private agentService: AgentService,
      private directionService: DirectionService,
      private drhServiceService: DrhServiceService,
      private gestionnaireService: GestionnaireService,
      private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadAgents();
    this.loadDirections();
    this.loadServices();
    this.setupServiceAutocomplete();
    this.setupDirectionAutocomplete();
  }

  loadAgents(): void {
    this.isLoading = true;
    this.agentService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Agent>) => {
        this.agents = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading agents:', error);
        this.isLoading = false;
      }
    });
  }

  loadDirections(): void {
    this.isLoading = true;
    this.directionService.getAll().subscribe({
      next: (directions) => {
        this.directions = directions;
        this.filteredDirections = directions;
        this.isLoading = false;
        console.log('Loaded directions:', this.directions); // Debug log
      },
      error: (error) => {
        console.error('Error loading directions:', error);
        this.isLoading = false;
      }
    });
  }

  loadServices(): void {
    this.isLoading = true;
    this.drhServiceService.getAll().subscribe({
      next: (services) => {
        this.services = services;
        this.filteredServices = services;
        this.isLoading = false;
        console.log('Loaded services:', this.services); // Debug log
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
      }
    });
  }

  setupServiceAutocomplete(): void {
    this.serviceCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          console.log('ServiceCtrl value:', value); // Debug log
          return typeof value === 'string' ? value : value.libelleService || '';
        }),
        map(value => this._filterServices(value))
    ).subscribe(filtered => {
      this.filteredServices = filtered;
      console.log('Filtered services:', this.filteredServices); // Debug log
    });

    this.serviceCtrl.valueChanges.subscribe(value => {
      console.log('Selected value:', value); // Debug log
      if (typeof value === 'object' && value) {
        this.criteriaAgent.codeService = value.codeService;
      } else {
        this.criteriaAgent.codeService = '';
      }
    });
  }

  setupDirectionAutocomplete(): void {
    this.directionCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          console.log('DirectionCtrl value:', value); // Debug log
          return typeof value === 'string' ? value : value.libelleDirection || '';
        }),
        map(value => this._filterDirections(value))
    ).subscribe(filtered => {
      this.filteredDirections = filtered;
      console.log('Filtered directions:', this.filteredDirections); // Debug log
    });

    this.directionCtrl.valueChanges.subscribe(value => {
      console.log('Selected value:', value); // Debug log
      if (typeof value === 'object' && value) {
        this.criteriaAgent.codeDirection = value.codeService;
      } else {
        this.criteriaAgent.codeService = '';
      }
    });
  }

  private _filterServices(value: string): DrhService[] {
    const filterValue = value.toLowerCase();
    console.log('Filtering with value:', filterValue); // Debug log
    return this.services.filter(service =>
        service.libelleService?.toLowerCase().includes(filterValue)
    );
  }
  private _filterDirections(value: string): Direction[] {
    const filterValue = value.toLowerCase();
    console.log('Filtering with value:', filterValue); // Debug log
    return this.directions.filter(service =>
        service.libelleDirection?.toLowerCase().includes(filterValue)
    );
  }

  displayDirectionFn(service: Direction): string {
    return service && service.libelleDirection ? service.libelleDirection : '';
  }

  displayServiceFn(service: DrhService): string {
    return service && service.libelleService ? service.libelleService : '';
  }

  searchAgents(): void {
    this.isLoading = true;
    console.log('Search criteria:', this.criteriaAgent); // Debug log
    this.agentService.searchByCriteria(this.criteriaAgent).subscribe({
      next: (agents) => {
        this.agents = agents;
        this.isLoading = false;
        console.log('Search results:', this.agents); // Debug log
      },
      error: (error) => {
        console.error('Erreur lors du chargement des agents:', error);
        this.isLoading = false;
      }
    });
  }

  initializeNewItem(): Agent {
    return new Agent();
  }

  openAddModal(content: any) {
    this.agentAdd = this.initializeNewItem();
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  addAgentConfirmation(index: number): void {
    this.agentAdd = this.agents[index];
    this.showConfirmationAgent = true;
  }

  confirmAddAgentConfirmation(modal: any): void {
    const gestionnaire = new Gestionnaire();
    gestionnaire.agent = this.agentAdd;
    this.gestionnaireService.create(gestionnaire).subscribe({
      next: () => {
        this.loadAgents();
        this.agentAdd = new Agent();
        this.showConfirmationAgent = false;
        modal.close('Confirm click');
      },
      error: (error) => {
        console.error('Error adding gestionnaire:', error);
        modal.dismiss('Error');
      }
    });
  }

  annulerAgentConfirmation(modal: any): void {
    this.agentAdd = new Agent();
    this.showConfirmationAgent = false;
    modal.dismiss('Cancel click');
  }

  clearSearch(): void {
    this.criteriaAgent = { matricule: '', codeService: '', codeDirection: '', prenoms: '', mail: '', nom: '', libelleDirection: '', libelleService: '' };
    this.serviceCtrl.setValue('');
    this.loadAgents();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page - 1;
      this.loadAgents();
    }
  }

  addToGestionnaire(agent: Agent): void {
    console.log(`Adding ${agent.nom || 'N/A'} ${agent.prenoms || 'N/A'} to gestionnaire`);
  }

  addToAdmin(agent: Agent): void {
    console.log(`Adding ${agent.nom || 'N/A'} ${agent.prenoms || 'N/A'} to admin`);
  }
}