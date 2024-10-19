<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
<!--          <el-icon><calendar /></el-icon>-->
          <span>All Replays</span>
        </span>
      </template>
      <el-table :data="tableDataGet" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="StreamNo" width="100" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[1] }}</template>
        </el-table-column>
        <el-table-column label="DateTime" width="150" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[2] }}</template>
        </el-table-column>
<!--        <el-table-column property="filename" label="File Name" width="120" />-->
        <el-table-column label="FileName" width="240" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[0] }}</template>
        </el-table-column>
        <el-table-column label="FileSize" width="150" show-overflow-tooltip>
          <template #default="scope">{{ scope.row[3] }}</template>
        </el-table-column>      </el-table>
    </el-tab-pane>
<!--    <el-tab-pane label="Config">Config</el-tab-pane>-->
<!--    <el-tab-pane label="Role">Role</el-tab-pane>-->
<!--    <el-tab-pane label="Task">Task</el-tab-pane>-->
  </el-tabs>
</template>

<script lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { onMounted , ref } from 'vue'

export default {
  components: {

  },
  setup(){

  const tableDataGet = ref([[] as tableDataGet[]]);
    const tableData: User[] = [
      {
        datetime: '2016-05-04 15:12',
        StreamNo: "1",

        filename: 'Aleyna Kutzner',
        filesize: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
      },
      {
        datetime: '2016-05-03',
        StreamNo: "1",
        filename: 'Helen Jacobi',
        filesize: '760 A Street, South Frankfield, Illinois',
      },
      {
        datetime: '2016-05-02',
        StreamNo: "1",

        filename: 'Brandon Deckert',
        filesize: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
      },
      {
        datetime: '2016-05-01',
        StreamNo: "1",

        filename: 'Margie Smith',
        filesize: '23618 Windsor Drive, West Ricardoview, Idaho',
      },
    ]
    const getReplays = () => {
      axios({
        method: 'get',
        url: useStore().state.baseUrl + '/fetchreplays',

      }).then(res => {
        tableDataGet.value = res.data
        console.log(tableDataGet.value)
      })
    }
    onMounted(async() => {
      await getReplays()
    });
    return {
        tableData,
        tableDataGet
    }
  }

}

</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
