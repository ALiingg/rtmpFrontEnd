<template>
  <!-- Tabs with a loading indicator -->
  <el-tabs type="border-card" class="demo-tabs" v-loading="isLoading">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <!-- Label for the "All Replays" tab -->
          <span>All Replays</span>
        </span>
      </template>

      <!-- Download button to trigger file downloads for selected rows -->
      <el-button type="primary" style="margin-bottom: 10px" @click="handleDownload"
        >Download</el-button
      >

      <!-- Table displaying the replays data -->
      <el-table :data="tableDataGet" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- Checkbox selection column -->
        <el-table-column type="selection" width="55" />

        <!-- Stream Number column -->
        <el-table-column
          label="StreamNo"
          width="100"
          show-overflow-tooltip
          :filters="[
            { text: '1', value: '1' },
            { text: '2', value: '2' },
            { text: '3', value: '3' },
            { text: '4', value: '4' }
          ]"
          :filter-method="filterStreamNo"
          filtered-value=""
        >
          <template #default="scope">{{ scope.row[1] }}</template>
        </el-table-column>

        <!-- Date and time column -->
        <el-table-column label="DateTime" width="150" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[2] }}</template>
        </el-table-column>

        <!-- File name column -->
        <el-table-column label="FileName" width="240" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[0] }}</template>
        </el-table-column>

        <!-- File size column, displays size in MB -->
        <el-table-column label="FileSize" width="150" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[3] }}MB</template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'

export default {
  components: {
    // Component-specific imports go here if needed
  },
  setup() {
    // State variable to track loading status
    const dateFilters = ref([]);
    const isLoading = ref(false)

    // Array to hold selected rows from the table
    const selectedRows = ref([])

    // Array to store data fetched from the server for the replays
    const tableDataGet = ref([[] as tableDataGet[]])

    // Sample data for the table (used if needed for testing)
    const tableData: User[] = [
      {
        datetime: '2016-05-04 15:12',
        StreamNo: '1',
        filename: 'Aleyna Kutzner',
        filesize: '100MB'
      },
      { datetime: '2016-05-03', StreamNo: '1', filename: 'Helen Jacobi', filesize: '200MB' },
      { datetime: '2016-05-02', StreamNo: '1', filename: 'Brandon Deckert', filesize: '150MB' },
      { datetime: '2016-05-01', StreamNo: '1', filename: 'Margie Smith', filesize: '120MB' }
    ]

    /**
     * Fetches replays data from the server and populates `tableDataGet`.
     * Sets the loading state while the request is in progress.
     */
    const getReplays = () => {
      isLoading.value = true
      axios({
        method: 'get',
        url: useStore().state.baseUrl + '/fetchreplays'
      }).then((res) => {
        tableDataGet.value = res.data // Populate the table data with response
        isLoading.value = false // Stop loading indicator
      })
    }

    const store = useStore() // Access Vuex store instance

    /**
     * Handles row selection in the table and updates `selectedRows`.
     * @param selection The selected rows from the table
     */
    const handleSelectionChange = (selection) => {
      selectedRows.value = selection
      console.log('Currently selected rows: ', selectedRows.value)
    }

    /**
     * Downloads the files for each selected row by opening the file URL in a new tab.
     */
    const handleDownload = () => {
      for (let i = 0; i < selectedRows.value.length; i++) {
        // Construct the download URL for each selected file and open it
        window.open(store.state.fileBaseUrl + '/' + selectedRows.value[i][0])
      }
    }

    // Call getReplays when the component is mounted to load initial data
    onMounted(async () => {
      await getReplays()
    })

    // Return state variables and methods to be used in the template
    return {
      tableData,
      tableDataGet,
      isLoading,
      handleSelectionChange,
      handleDownload
    }
  }
}
</script>

<style>
/* Style for the tab content area */
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

/* Style for the custom tab label with an icon */
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

/* Adjusts spacing for the label text */
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
