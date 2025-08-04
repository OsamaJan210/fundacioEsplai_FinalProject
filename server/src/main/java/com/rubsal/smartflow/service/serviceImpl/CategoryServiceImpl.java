package com.rubsal.smartflow.service.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.Locale.Category;

import org.springframework.stereotype.Service;

import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.repository.CategoryRepo;
import com.rubsal.smartflow.service.CategoryService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import lombok.AllArgsConstructor;
import lombok.Data;

@Service("CategoryService")
@Data
public class CategoryServiceImpl implements CategoryService  {

    private final General general;
    private final CategoryRepo categoryRepo;
    @Override
    public String createCategory(SfCategory req){
        try{
            categoryRepo.save(req);
            return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }

    }
    @Override
    public String gatAllCategory(){
        List<SfCategory> category=categoryRepo.findAll();
        return general.buildResponseObject(category).toString();

    }
    @Override
    public String getById(Integer id){
        List<SfCategory> category=categoryRepo.findAllById(id);
        return general.buildResponseObject(category).toString();

    }
    
}
