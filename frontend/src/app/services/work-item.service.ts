import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkItem } from 'src/app/models/work-item';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {
  workItems: WorkItem[];
  workItems$: Subject<WorkItem[]>;

  workItemsUrl = 'http://localhost:4000/api/workitems';

  //workItems: WorkItem[] = [];

  constructor(private http: HttpClient) {
    this.workItems = [];
    this.workItems$ = new Subject();
  }

  sendWorkItems(workItems: WorkItem[]) {
    this.workItems$.next(workItems);
  }

  getWorkItems$(): Observable<WorkItem[]> {
    return this.workItems$.asObservable();
  }

  getWorkItems(): Observable<WorkItem[]> {
    return this.http.get<WorkItem[]>(this.workItemsUrl);
  }

  updateWorkItem(workItem?: WorkItem) {
    return this.http.put(this.workItemsUrl + `/${workItem?._id}`, workItem);
  }

  filterWorkItemsByPanelName(workItems: WorkItem[], panelName: string): WorkItem[] {
    // array de workItem donde guardaremos los workItems del panel
    let workItemsOfPanel: WorkItem[] = [];

    for (let workItem of workItems) {
      // nombre del panel del workItem
      let workItemPanel = workItem.panel;

      // Si el panel del workItem corresponde con panelName, lo guardamos
      if (workItemPanel == panelName) {
        workItemsOfPanel.push(workItem);
      }
    }

    return workItemsOfPanel;
  }

  // Obtiene los nombres de los workItems y los ordena por posición
  getWorkItemNames(workItems: WorkItem[]): string[] {
    let workItemsNames: string[] = [];

    // Ordenar los workItems por el número de posición
    let sortedWorkItemsByPosition = this.sortWorkItemsByPosition(workItems);

    // Obtiene el nombre de cada workItem
    for(let workItem of sortedWorkItemsByPosition) {
      workItemsNames.push(workItem.name);
    }

    return workItemsNames;
  }

  // Ordena los workItems según el número de posición
  sortWorkItemsByPosition(workItems: WorkItem[]): WorkItem[] {
    return workItems.sort(function(a, b) {
      return a.position - b.position;
    });
  }

}
