import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { WorkItem } from 'src/app/models/work-item';

// Material
// MatDialog --> Servicio
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

// Servicios
import { ProjectService } from 'src/app/services/project.service';
import { WorkItemService } from 'src/app/services/work-item.service';

// Componentes
import { WorkItemListComponent } from '../work-item-list/work-item-list.component';
import { WorkItemDialogComponent } from '../work-item-dialog/work-item-dialog.component';

@Component({
  selector: 'app-work-item',
  templateUrl: './work-item.component.html',
  styleUrls: ['./work-item.component.css']
})
export class WorkItemComponent implements OnInit {
  @Input() workItemIdNumber!: number;
  @Input() panelName: string = '';
  @Input() workItemListComponent!: WorkItemListComponent;
  // workItemIdNumber!: number;

  projectId: any = '';

  workItem!: WorkItem;

  workItemsOfPanel!: WorkItem[];

  constructor(private projectService: ProjectService, private workItemService: WorkItemService, private route: ActivatedRoute, private dialog: MatDialog) { }

  async ngOnInit() {
    this.getProjectId();

    try {
      let workItems = await lastValueFrom(this.getWorkItemsOfProject());
      this.workItem = this.getWorkItemByIdNumber(workItems, this.workItemIdNumber);
      this.workItemsOfPanel = this.filterWorkItems_ByPanelName(workItems, this.panelName);
    }
    catch (error) {
      console.log(error);
    }
  }

  // INICIALIZAR EL COMPONENTE
  getProjectId() {
    this.projectId = this.route.snapshot.paramMap.get('id');
  }

  getWorkItemsOfProject(): Observable<WorkItem[]> {
    return this.projectService.getWorkItems(this.projectId);
  }

  getWorkItemByIdNumber(workItemList: WorkItem[], idNumber: number): WorkItem {
    return this.workItemService.getWorkItemByIdNumber(workItemList, idNumber);
  }

  // Diálogo que se abre al pinchar en el workItem
  async openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.width = '800px';

    dialogConfig.data = {
      idNumber: this.workItemIdNumber,
      title: this.workItem.title,
      description: this.workItem.description,
      tags: this.workItem.tags,
      projectId: this.projectId
    }

    const dialogRef = this.dialog.open(WorkItemDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      async data => {
        // Si no le llegan datos no se hace nada
        if (!data) return;

        // Si data es 'delete' eliminamos el workItem
        if (data == 'delete') {
          this.deleteWorkItem();
          return;
        }

        // Si llegan datos y no es 'delete' actualizamos el title y description del componente
        await this.updateWorkItemTitleDescriptionTags(data.title, data.description, data.tags);
      }
    );
  }

  /* EDITAR Y ELIMINAR WorkItem */
  // Eliminar WorkItem
  async deleteWorkItem() {
    // Obtenemos los workItems que se van a actualizar (por si ha sufrido alguna modificación antes, como la posición)
    try {
      let workItems = await lastValueFrom(this.getWorkItemsOfProject());
      this.workItem = this.getWorkItemByIdNumber(workItems, this.workItemIdNumber);
      this.workItemsOfPanel = this.filterWorkItems_ByPanelName(workItems, this.panelName);
    }
    catch (error) {
      console.log(error)
    }

    // Reducir en 1 la posición de los workItems afectados
    let workItemPosition = this.workItem.position;
    for (let wI of this.workItemsOfPanel) {
      if (wI.position > workItemPosition) {
        // Reducir su posición en 1
        wI.position--;

        // Actualizar el workItem
        try {
          let res = await lastValueFrom(this.workItemService.updateWorkItem(wI));
          console.log(res);
        }
        catch (error) {
          console.log(error)
        }
      }
    }

    // Id del workItem
    let workItemId = this.workItem._id;

    // Eliminar workItem de la bdd
    try {
      let res = await lastValueFrom(this.workItemService.deleteWorkItem(workItemId));
      console.log(res);
    }
    catch (error) {
      console.log(error)
    }

    // Eliminar la referencia de la lista del proyecto
    try {
      let res = await lastValueFrom(this.projectService.removeWorkItem(this.projectId, workItemId));
      console.log(res);
    }
    catch (error) {
      console.log(error)
    }

    // Actualizar la lista de WorkItemListComponent
    let idNumbersOfList = this.workItemListComponent.workItemsOfPanel_IdNumbers;
    let lengthIdNumbers = this.workItemListComponent.workItemsOfPanel_IdNumbers.length;

    // buscamos el idNumber del workItem en la lista, y lo eliminamos
    for (let i = 0; i < lengthIdNumbers; i++) {
      if (parseInt(idNumbersOfList[i]) == this.workItem.idNumber) {
        idNumbersOfList.splice(i, 1);
        // break porque ahora idNumbersOfList.length es uno menos que lengthIdNumbers. En la última iteración, idNumbersOfList[i] sería undefined
        break;
      }
    }
  }

  // Editar WorkItem
  async updateWorkItemTitleDescriptionTags(title: string, description: string, tags: string[]) {
    // Obtenemos el workItem que se va a actualizar (por si ha sufrido alguna modificación antes, como la posición)
    try {
      let workItems = await lastValueFrom(this.getWorkItemsOfProject());
      this.workItem = this.getWorkItemByIdNumber(workItems, this.workItemIdNumber);
    }
    catch (error) {
      console.log(error)
    }

    // Eliminar espacios no deseados en el title
    let titleNoSpaces = title.replace(/\s+/g,' ').trim();

    // Actualizar el workItem
    this.workItem.title = titleNoSpaces;
    this.workItem.description = description;
    try {
      let res = await lastValueFrom(this.workItemService.updateWorkItem(this.workItem));
      console.log(res);
    }
    catch (error) {
      console.log(error)
    }
  }

  getTagByName() {
    
  }

  filterWorkItems_ByPanelName(workItems: WorkItem[], panelName: string): WorkItem[] {
    return this.workItemService.filterWorkItems_ByPanelName(workItems, panelName);
  }

}
